import Sidebar from "../components/sidebar.js";
import "../../../styles/dashboard.css";
import getStatistik from "../../data/statistikApi.js";
import getStatusAnak from "../../data/statusAnakApi.js";
import Chart from "chart.js/auto";

let chartInstance = null;

const DashboardPage = {
  async render() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.hash = "/login";
      return "";
    }

    return `
      <div class="dashboard-layout">
        ${Sidebar.render()}
        <main class="main-content">
          <h2>Dashboard</h2>

          <!-- Dropdown pilih tahun -->
          <div class="tahun-select-container">
            <label for="tahun-select">Pilih Tahun: </label>
            <select id="tahun-select"></select>
          </div>

          <div class="chart-container">
            <canvas id="stuntingChart"></canvas>
          </div>

          <div class="summary-boxes">
            <div class="summary-box" data-status="Severely Stunted">
              Daftar Anak Penderita Stunting
              <span id="severely-stunted-count">...</span>
            </div>
            <div class="summary-box" data-status="Stunted">
              Daftar Anak Berpotensi Stunting
              <span id="stunted-count">...</span>
            </div>
            <div class="summary-box" data-status="Normal">
              Daftar Anak Normal
              <span id="normal-count">...</span>
            </div>
          </div>

          <!-- Modal -->
          <div id="anak-modal" class="modal-backdrop hidden">
            <div class="modal">
              <div class="modal-header">
                <h2 id="modal-title">Daftar Anak</h2>
                <button class="modal-close" onclick="closeDashboardModal()">&times;</button>
              </div>
              <div class="modal-body" id="modal-list"></div>
            </div>
          </div>
        </main>
      </div>
    `;
  },

  async afterRender() {
    Sidebar.afterRender();

    const token = localStorage.getItem("token");
    const statistik = await getStatistik(token);
    const anakData = await getStatusAnak(token);

    console.log("=== Anak Data ===");
    anakData.forEach((anak) => {
      console.log(
        `${anak.nama} | label: ${anak.label} | tahun: ${new Date(
          anak.created_at
        ).getFullYear()}`
      );
    });

    if (statistik) {
      let tahunList = Object.keys(statistik).sort().reverse();

      // Pastikan hanya ada 1 "All"
      if (!tahunList.includes("All")) {
        tahunList.unshift("All");
      }

      const tahunSelect = document.getElementById("tahun-select");

      // Isi dropdown tahun
      tahunSelect.innerHTML = ""; // Clear dulu supaya tidak duplikat
      tahunList.forEach((tahun) => {
        const option = document.createElement("option");
        option.value = tahun === "All" ? "All" : tahun; // Value = "All"
        option.textContent = tahun === "All" ? "Semua Tahun" : tahun;
        tahunSelect.appendChild(option);
      });

      // Default tahun aktif = "All"
      let tahunAktif = "All";
      updateDashboard(tahunAktif, statistik, anakData);

      // Event change tahun
      tahunSelect.addEventListener("change", (e) => {
        tahunAktif = e.target.value;
        updateDashboard(tahunAktif, statistik, anakData);
      });

      // Event click card
      document.querySelectorAll(".summary-box").forEach((box) => {
        box.addEventListener("click", () => {
          const status = box.getAttribute("data-status");

          // MAPPING agar cocok dengan label anakData
          const labelMapping = {
            "Severely Stunted": [
              "Penderita Stunting",
              "Severely Stunted",
              "Severely stunted",
              "SEVERELY STUNTED",
            ],
            Stunted: ["Berpotensi Stunting", "Stunted"],
            Normal: ["Normal"],
          };

          const targetLabels = labelMapping[status] || [status];

          console.log(
            `=== Klik Status: ${status} → TargetLabels: ${targetLabels}`
          );

          const filtered = anakData.filter((anak) => {
            const tahunAnak = new Date(anak.created_at)
              .getFullYear()
              .toString();
            return (
              targetLabels
                .map((l) => l.toLowerCase().trim())
                .includes(anak.label.toLowerCase().trim()) &&
              (tahunAktif === "All" || tahunAnak === tahunAktif)
            );
          });

          console.log("Anak Data Matching:");
          filtered.forEach((a) => {
            console.log(
              `${a.nama} | Label: ${a.label} | Tahun: ${new Date(
                a.created_at
              ).getFullYear()}`
            );
          });

          tampilkanModal(filtered, status, tahunAktif);
        });
      });

      // Modal close actions
      document.getElementById("anak-modal").addEventListener("click", (e) => {
        if (e.target.id === "anak-modal") {
          closeDashboardModal();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          closeDashboardModal();
        }
      });

      // Expose closeDashboardModal ke global
      window.closeDashboardModal = closeDashboardModal;
    } else {
      console.warn("Data statistik tidak tersedia.");
    }
  },
};

function updateDashboard(tahun, statistik, anakData) {
  const chartTahun =
    tahun === "All" ? Object.keys(statistik).sort().reverse()[0] : tahun;
  const dataTahun = statistik[chartTahun];

  document.getElementById("normal-count").textContent = dataTahun.Normal || 0;
  document.getElementById("stunted-count").textContent = dataTahun.Stunted || 0;
  document.getElementById("severely-stunted-count").textContent =
    dataTahun["Severely Stunted"] || 0;

  const ctx = document.getElementById("stuntingChart").getContext("2d");

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Normal", "Stunted", "Severely Stunted"],
      datasets: [
        {
          label: `Statistik Anak Berdasarkan Status Gizi (Tahun ${chartTahun})`,
          data: [
            dataTahun.Normal,
            dataTahun.Stunted,
            dataTahun["Severely Stunted"],
          ],
          fill: false,
          borderColor: "#4caf50",
          backgroundColor: "#4caf50",
          tension: 0.3,
          pointRadius: 5,
          pointBackgroundColor: ["#4caf50", "#ff9800", "#f44336"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: `Statistik Anak Berdasarkan Status Gizi (Tahun ${chartTahun})`,
        },
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1 },
        },
      },
    },
  });
}

function tampilkanModal(data, status, tahunAktif) {
  const modal = document.getElementById("anak-modal");
  const title = document.getElementById("modal-title");
  const body = document.getElementById("modal-list");

  const sorted = [...data].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  title.textContent = `Daftar Anak dengan Status: ${getLabelDisplay(status)} (${
    tahunAktif === "All" ? "Semua Tahun" : `Tahun ${tahunAktif}`
  })`;

  body.innerHTML =
    sorted.length === 0
      ? `<p><em>Tidak ada anak dengan status ini di ${
          tahunAktif === "All" ? "Semua Tahun" : `tahun ${tahunAktif}`
        }.</em></p>`
      : sorted
          .map(
            (anak) => `
    <div class="anak-item-card">
      <div class="anak-item-header"><strong>${anak.nama}</strong></div>
      <div class="anak-item-body">
        ${anak.jenis_kelamin} • Umur: ${anak.umur_bulan} bln<br>
        TB: ${anak.tinggi_badan} cm • BB: ${anak.berat_badan} kg
      </div>
      <div class="anak-item-footer">
        Tanggal input: ${new Date(anak.created_at).toLocaleDateString()}
      </div>
    </div>`
          )
          .join("");

  modal.classList.remove("hidden");
  modal.classList.add("open");
}

function closeDashboardModal() {
  const modal = document.getElementById("anak-modal");
  modal.classList.remove("open");
  modal.classList.add("hidden");
}

function getLabelDisplay(label) {
  switch (label) {
    case "Severely Stunted":
      return "Penderita Stunting";
    case "Stunted":
      return "Berpotensi Stunting";
    case "Normal":
      return "Normal";
    default:
      return label;
  }
}

export default DashboardPage;

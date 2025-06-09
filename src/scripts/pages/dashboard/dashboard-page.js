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
          <div id="anak-modal" class="anak-modal hidden">
            <div class="anak-modal-content">
              <span class="close-modal">&times;</span>
              <h3 id="modal-title"></h3>
              <ul id="modal-list" style="list-style: none; padding: 0;"></ul>
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

    // === Log Debug ===
    console.log("=== Statistik ===", statistik);
    console.log("=== Tahun terbaru ===", Object.keys(statistik).sort().reverse()[0]);

    console.log("=== Semua Anak dengan tahun ===", anakData.map(a => ({
      nama: a.nama,
      label: a.label,
      tahun: new Date(a.created_at).getFullYear()
    })));

    // === End Log Debug ===

    if (statistik) {
      const tahunList = Object.keys(statistik).sort().reverse();
      const tahunSelect = document.getElementById("tahun-select");

      // Isi dropdown tahun
      tahunList.forEach((tahun) => {
        const option = document.createElement("option");
        option.value = tahun;
        option.textContent = tahun;
        tahunSelect.appendChild(option);
      });

      // Default tahun aktif = tahun terbaru
      let tahunAktif = tahunList[0];
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

          // Filter anak per tahun aktif
          const filtered = anakData.filter((anak) => {
            const tahunAnak = new Date(anak.created_at).getFullYear().toString();
            return anak.label === status && tahunAnak === tahunAktif;
          });

          tampilkanModal(filtered, status, tahunAktif);
        });
      });

      // Modal close actions
      document.querySelector(".close-modal").addEventListener("click", () => {
        document.getElementById("anak-modal").classList.add("hidden");
      });

      document.getElementById("anak-modal").addEventListener("click", (e) => {
        if (e.target.id === "anak-modal") {
          document.getElementById("anak-modal").classList.add("hidden");
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          document.getElementById("anak-modal").classList.add("hidden");
        }
      });
    } else {
      console.warn("Data statistik tidak tersedia.");
    }
  },
};

function updateDashboard(tahun, statistik, anakData) {
  const dataTahun = statistik[tahun];

  // Update summary box
  document.getElementById("normal-count").textContent = dataTahun.Normal || 0;
  document.getElementById("stunted-count").textContent = dataTahun.Stunted || 0;
  document.getElementById("severely-stunted-count").textContent = dataTahun["Severely Stunted"] || 0;

  // Update chart
  const ctx = document.getElementById("stuntingChart").getContext("2d");

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Normal", "Stunted", "Severely Stunted"],
      datasets: [
        {
          label: `Statistik Anak Berdasarkan Status Gizi (Tahun ${tahun})`,
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
          text: `Statistik Anak Berdasarkan Status Gizi (Tahun ${tahun})`,
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
  const list = document.getElementById("modal-list");

  const sorted = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  title.textContent = `Daftar Anak dengan Status: ${getLabelDisplay(status)} (Tahun ${tahunAktif})`;

  list.innerHTML =
    sorted.length === 0
      ? `<li>Tidak ada anak dengan status ini di tahun ${tahunAktif}.</li>`
      : sorted
          .map(
            (anak) => `
      <li class="anak-item-card">
        <div class="anak-item-header"><strong>${anak.nama}</strong></div>
        <div class="anak-item-body">
          ${anak.jenis_kelamin} • Umur: ${anak.umur_bulan} bln<br>
          TB: ${anak.tinggi_badan} cm • BB: ${anak.berat_badan} kg
        </div>
        <div class="anak-item-footer">
          Tanggal input: ${new Date(anak.created_at).toLocaleDateString()}
        </div>
      </li>`
          )
          .join("");

  modal.classList.remove("hidden");
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

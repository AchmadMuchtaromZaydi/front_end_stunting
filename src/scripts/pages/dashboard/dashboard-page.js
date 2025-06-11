// src/scripts/pages/dashboard/dashboard-page.js

import Sidebar from "../components/sidebar.js";
import "../../../styles/dashboard.css";
import "../../../styles/dashboard-responsive.css";
import getStatistik from "../../data/statistikApi.js";
import getStatusAnak from "../../data/statusAnakApi.js";
import Chart from "chart.js/auto";


let chartInstance = null;
let tahunAktif = "All";

const labelOrder = ["Normal", "Stunted", "Severely Stunted"];

const labelMappingAPI = {
  Normal: ["Normal"],
  Stunted: ["Stunting"],
  "Severely Stunted": ["Berpotensi Stunting"],
};

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
       <div class="dashboard-layout">
          <div class="main-inner">
            <h2>Dashboard</h2>

            <div class="tahun-select-container">
              <label for="tahun-select">Pilih Tahun: </label>
              <select id="tahun-select"></select>
            </div>

            <div class="chart-container">
              <canvas id="stuntingChart"></canvas>
            </div>

            <div class="summary-boxes">
              ${labelOrder
                .map(
                  (label) => `
                <div class="summary-box" data-status="${label}">
                  Daftar Anak ${getLabelDisplay(label)} 
                  <span id="${getSpanId(label)}">...</span>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </main>
      </div>

      <div id="anak-modal" class="anak-modal hidden">
        <div class="modal">
          <div class="modal-header">
            <h2 id="modal-title">Daftar Anak</h2>
            <button class="modal-close" onclick="closeDashboardModal()">×</button>
          </div>
          <div class="modal-body" id="modal-list"></div>
        </div>
      </div>
    `;
  },

  async afterRender() {
    Sidebar.afterRender();

    const token = localStorage.getItem("token");
    const statistik = await getStatistik(token);
    const anakData = await getStatusAnak(token);

    if (!statistik) {
      console.warn("Data statistik tidak tersedia.");
      return;
    }

    const tahunList = Object.keys(statistik).sort().reverse();
    if (!tahunList.includes("All")) tahunList.unshift("All");

    const tahunSelect = document.getElementById("tahun-select");
    tahunSelect.innerHTML = "";
    tahunList.forEach((tahun) => {
      const option = document.createElement("option");
      option.value = tahun;
      option.textContent = tahun === "All" ? "Semua Tahun" : tahun;
      tahunSelect.appendChild(option);
    });

    tahunAktif = "All";
    updateDashboard(tahunAktif, statistik, anakData);

    tahunSelect.addEventListener("change", (e) => {
      tahunAktif = e.target.value;
      updateDashboard(tahunAktif, statistik, anakData);
    });

    document.querySelectorAll(".summary-box").forEach((box) => {
      box.addEventListener("click", () => {
        const status = box.getAttribute("data-status");
        const targetLabels = labelMappingAPI[status] || [status];

        const filtered = anakData.filter((anak) => {
          const tahunAnak = new Date(anak.created_at).getFullYear().toString();
          const label = anak.label?.toLowerCase().trim();
          return (
            targetLabels.map((l) => l.toLowerCase().trim()).includes(label) &&
            (tahunAktif === "All" || tahunAnak === tahunAktif)
          );
        });

        tampilkanModal(filtered, status, tahunAktif);
      });
    });

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

    window.closeDashboardModal = closeDashboardModal;
  },
};

function updateDashboard(tahun, statistik, anakData) {
  const chartTahun =
    tahun === "All" ? Object.keys(statistik).sort().reverse()[0] : tahun;
  const dataTahun = statistik[chartTahun];

  labelOrder.forEach((label) => {
    const span = document.getElementById(getSpanId(label));
    if (span) {
      span.textContent = dataTahun[label] || 0;
    }
  });

  const ctx = document.getElementById("stuntingChart").getContext("2d");

  if (chartInstance) chartInstance.destroy();

chartInstance = new Chart(ctx, {
  type: "line",
  data: {
    labels: labelOrder,
    datasets: [
      {
        label: `Statistik Anak Berdasarkan Status Gizi (Tahun ${chartTahun})`,
        data: labelOrder.map((label) => dataTahun[label] || 0),
        fill: false,
        borderColor: "#4caf50",
        backgroundColor: "#4caf50",
        tension: 0.3,
        pointRadius: 5,
        pointBackgroundColor: ["#4caf50", "#ff9800", "#f44336"],
      },
    ],
  },
  options: {  // <--- disini bro
    layout: {
      padding: 0, // supaya canvas bener2 full
    },
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
          tahunAktif === "All" ? "Semua Tahun" : `Tahun ${tahunAktif}`
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
        </div>
      `
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
      return "Berpotensi Stunting";
    case "Stunted":
      return "Penderita Stunting";
    case "Normal":
      return "Normal";
    default:
      return label;
  }
}

function getSpanId(label) {
  switch (label) {
    case "Severely Stunted":
      return "severely-stunted-count";
    case "Stunted":
      return "stunted-count";
    case "Normal":
      return "normal-count";
    default:
      return "";
  }
}

export default DashboardPage;

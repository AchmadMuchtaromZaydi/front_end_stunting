import { getStepStatus } from "../../utils/auth-guard.js";
import "../../../styles/step-indicator.css"
const StepIndicator = {
  render(activeStep = 1) {
    const { step1, step2, step3 } = getStepStatus();

    const steps = [
      { label: "Registrasi", done: step1, active: activeStep === 1 },
      { label: "Profil", done: step2, active: activeStep === 2 },
      { label: "Welcome", done: step3, active: activeStep === 3 },
    ];

    return `
      <div class="step-indicator">
        ${steps
          .map((step, idx) => {
            const stepHtml = `
              <div class="step ${step.active ? "active" : ""} ${
              step.done ? "done" : ""
            }">
                <div class="step-number">${step.done ? "✓" : idx + 1}</div>
                ${
                  step.active
                    ? `<div class="step-label">${step.label}</div>`
                    : ""
                }
              </div>
            `;

            // Tambahkan panah kecuali setelah step terakhir
            const arrowHtml =
              idx < steps.length - 1 ? `<div class="step-arrow">➜</div>` : "";

            return stepHtml + arrowHtml;
          })
          .join("")}
      </div>
    `;
  },
};

export default StepIndicator;

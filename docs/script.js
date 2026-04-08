/* =========================================================
   NHS DOWNTIME TRACKING TOOL — CLEAN REWRITE (UNIFIED DROPDOWNS)
   ========================================================= */

/* ------------------------------
   0. CONFIG + KILL SWITCH
   ------------------------------ */

function decode(value) {
  return atob(value);
}

const config = {
  twTable: decode("__TW_TABLE_DATA__"),
  mghTable: decode("__MGH_TABLE_DATA__"),
  formUrl: decode("__FORM_DATA__"),
  authorName: decode("__AUTHOR_DATA__"),
  killSwitch: "__KILL_SWITCH__",
};

if (config.killSwitch === "UPTIME") {
  document.body.innerHTML = `
    <div style="padding:40px; text-align:center; font-family:Arial;">
      <h2>ED Downtime Tool Disabled</h2>
      <p>The live EPR system is currently available.</p>
    </div>`;
  throw new Error("Kill switch active — stopping script execution.");
}

/* ------------------------------
   1. DOM REFERENCES
   ------------------------------ */

const desktopContainer = document.getElementById("desktopContainer");
const mobileContainer = document.getElementById("mobileContainer");

const toolsButton = document.getElementById("toolsButton");
const toolsMenu = document.getElementById("toolsMenu");
const activeToolLabel = document.getElementById("activeToolLabel");

const hospitalButton = document.getElementById("hospitalButton");
const hospitalMenu = document.getElementById("hospitalMenu");
const activeHospital = document.getElementById("activeHospital");

const locationButton = document.getElementById("locationButton");
const locationMenu = document.getElementById("locationMenu");
const activeLocation = document.getElementById("activeLocation");

const timestamp = document.getElementById("timestamp");
const loadingSpinner = document.getElementById("loadingSpinner");
const iframe = document.getElementById("dashboardFrame");
const selectorBar = document.getElementById("selectorBar");

const toolTracking = document.getElementById("toolTracking");
const toolAddPatient = document.getElementById("toolAddPatient");

/* ------------------------------
   2. MOBILE DETECTION
   ------------------------------ */

function detectMobileMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("mobile") === "1") return true;
  if (params.get("mobile") === "0") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

window.addEventListener("load", () => {
  const mobile = detectMobileMode();

  if (mobile) {
    desktopContainer.style.display = "none";
    mobileContainer.style.display = "block";

    toolsButton.classList.add("mobileVersionBox");

    const clone = toolsButton.cloneNode(true);
    toolsButton.parentNode.replaceChild(clone, toolsButton);

    const labelSpan = clone.querySelector("#activeToolLabel");
    if (labelSpan) labelSpan.textContent = "Mobile Version";

    const menu = clone.querySelector("#toolsMenu");
    if (menu) menu.style.display = "none";

    timestamp.style.display = "none";

    clone.onclick = () => {
      const url = new URL(window.location.href);
      url.searchParams.set("mobile", "0");
      window.location.href = url.toString();
    };
  } else {
    desktopContainer.style.display = "block";
    mobileContainer.style.display = "none";
  }
});

/* ------------------------------
   3. MOBILE FUNCTIONS
   ------------------------------ */

function showHospitalSelector() {
  document.getElementById("mobileMenu").style.display = "none";
  document.getElementById("hospitalSelector").style.display = "block";
}

function goBack() {
  document.getElementById("hospitalSelector").style.display = "none";
  document.getElementById("mobileMenu").style.display = "block";
}

function openTW() {
  window.location.href = config.twTable;
}

function openMGH() {
  window.location.href = config.mghTable;
}

function openForm() {
  window.location.href = config.formUrl;
}

/* ------------------------------
   4. DEFAULT SELECTIONS
   ------------------------------ */

window.addEventListener("DOMContentLoaded", () => {
  toolTracking.classList.add("selectedItem");
  activeToolLabel.textContent = "Tracking Board";

  hospitalMenu.querySelector("div:nth-child(1)").classList.add("active");
  activeHospital.textContent = "Tunbridge Wells";

  locationMenu.querySelector("div:nth-child(1)").classList.add("active");
  activeLocation.textContent = "Whole Dept";

  loadIframeForHospital("TWH");

  const footerAuthor = document.getElementById("footerAuthor");
  if (footerAuthor) footerAuthor.textContent = config.authorName;
});

/* ------------------------------
   5. UNIFIED DROPDOWN SYSTEM
   ------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".dropdownTrigger");

  // Toggle dropdowns
  triggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();

      document.querySelectorAll(".dropdownList.open").forEach((menu) => {
        if (!trigger.contains(menu)) menu.classList.remove("open");
      });

      const menu = trigger.querySelector(".dropdownList");
      if (menu) menu.classList.toggle("open");
    });
  });

  // Close when clicking outside
  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdownList.open").forEach((menu) => {
      menu.classList.remove("open");
    });
  });

  // Handle item selection
  document.querySelectorAll(".dropdownList div").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();

      const menu = item.closest(".dropdownList");
      const trigger = menu.closest(".dropdownTrigger");

      menu.querySelectorAll("div").forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const label = trigger.querySelector("span");
      if (label) label.textContent = item.textContent.trim();

      menu.classList.remove("open");
    });
  });
});

/* ------------------------------
   6. IFRAME LOADING + TIMESTAMP
   ------------------------------ */

iframe.onload = () => {
  loadingSpinner.style.display = "none";
  updateTimestamp();
};

function loadIframeForHospital(name) {
  loadingSpinner.style.display = "block";

  iframe.src = name === "TWH" ? config.twTable : config.mghTable;

  iframe.onload = () => {
    loadingSpinner.style.display = "none";
    updateTimestamp();
  };
}

/* ------------------------------
   7. TOOL SWITCHING
   ------------------------------ */

function highlightTool(tool) {
  toolTracking.classList.remove("selectedItem");
  toolAddPatient.classList.remove("selectedItem");
  tool.classList.add("selectedItem");
}

function loadTrackingBoard() {
  activeToolLabel.textContent = "Tracking Board";
  selectorBar.style.display = "flex";
  loadingSpinner.style.display = "block";

  highlightTool(toolTracking);

  const hospital = activeHospital.textContent;
  loadIframeForHospital(hospital === "Tunbridge Wells" ? "TWH" : "MGH");

  iframe.classList.remove("iframeForm");
  iframe.classList.add("iframeTracking");
}

function loadForm() {
  activeToolLabel.textContent = "Add Patient";
  selectorBar.style.display = "none";
  loadingSpinner.style.display = "block";

  highlightTool(toolAddPatient);

  iframe.src = config.formUrl;

  iframe.classList.remove("iframeTracking");
  iframe.classList.add("iframeForm");
}

/* ------------------------------
   8. HOSPITAL + LOCATION SELECTORS
   ------------------------------ */

function selectHospital(name) {
  activeHospital.textContent = name;
  loadIframeForHospital(name === "Tunbridge Wells" ? "TWH" : "MGH");
}

function selectLocation(name) {
  activeLocation.textContent = name;
}

/* ------------------------------
   9. REFRESH LOGIC
   ------------------------------ */

function manualRefresh() {
  // Only refresh if we're on the Tracking Board
  if (activeToolLabel.textContent !== "Tracking Board") return;

  // Keep the UI consistent
  activeToolLabel.textContent = "Tracking Board";
  toolTracking.classList.add("selectedItem");
  toolAddPatient.classList.remove("selectedItem");

  // Close the tools menu
  toolsMenu.classList.remove("open");

  // Perform the refresh
  loadingSpinner.style.display = "block";

  const base = iframe.src.split("?")[0];
  const params = iframe.src.split("?")[1];

  iframe.src = `${base}?${params}&manual=${Date.now()}`;
}

setInterval(() => {
  if (activeToolLabel.textContent !== "Tracking Board") return;

  loadingSpinner.style.display = "block";

  const base = iframe.src.split("?")[0];
  const params = iframe.src.split("?")[1];

  iframe.src = `${base}?${params}&auto=${Date.now()}`;
}, 300000);

/* ------------------------------
   10. TIMESTAMP
   ------------------------------ */

function updateTimestamp() {
  timestamp.textContent =
    "Last refreshed at " +
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
}

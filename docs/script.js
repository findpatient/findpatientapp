/* =========================================================
   NHS DOWNTIME TRACKING TOOL — SCRIPT FILE
   ========================================================= */

/* ------------------------------
   0. Config values 
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

/* ------------------------------
   0a. Kill Switch
   ------------------------------ */

if (config.killSwitch === "UPTIME") {
  document.body.innerHTML = `
        <div style="padding:40px; text-align:center; font-family:Arial;">
            <h2>ED Downtime Tool Disabled</h2>
            <p>The live EPR system is currently available.</p>
        </div>
    `;
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

const timestamp = document.getElementById("timestamp");
const loadingSpinner = document.getElementById("loadingSpinner");

const iframe = document.getElementById("dashboardFrame");
const selectorBar = document.getElementById("selectorBar");

const toolTracking = document.getElementById("toolTracking");
const toolAddPatient = document.getElementById("toolAddPatient");

const hospitalButton = document.getElementById("hospitalButton");
const hospitalMenu = document.getElementById("hospitalMenu");
const activeHospital = document.getElementById("activeHospital");

const locationButton = document.getElementById("locationButton");
const locationMenu = document.getElementById("locationMenu");
const activeLocation = document.getElementById("activeLocation");

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

/* MOBILE REDIRECTS — iOS cannot embed M365 */
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

  hospitalMenu.querySelector("div:nth-child(1)").classList.add("selectedItem");
  activeHospital.textContent = "Tunbridge Wells";

  locationMenu.querySelector("div:nth-child(1)").classList.add("selectedItem");
  activeLocation.textContent = "Whole Dept";

  /* Load TWH by default */
  loadIframeForHospital("TWH");

  /* Inject obfuscated author name */
  const footerAuthor = document.getElementById("footerAuthor");
  if (footerAuthor) footerAuthor.textContent = config.authorName;
});

/* ------------------------------
   5. DESKTOP MENU LOGIC
   ------------------------------ */
toolsButton.addEventListener("click", () => {
  const isOpen = toolsMenu.style.display === "block";
  toolsMenu.style.display = isOpen ? "none" : "block";

  hospitalMenu.style.display = "none";
  locationMenu.style.display = "none";

  toolsButton.classList.toggle("activeButton", !isOpen);
  hospitalButton.classList.remove("activeButton");
  locationButton.classList.remove("activeButton");
});

hospitalButton.addEventListener("click", () => {
  const isOpen = hospitalMenu.style.display === "block";
  hospitalMenu.style.display = isOpen ? "none" : "block";

  toolsMenu.style.display = "none";
  locationMenu.style.display = "none";

  hospitalButton.classList.toggle("activeButton", !isOpen);
  toolsButton.classList.remove("activeButton");
  locationButton.classList.remove("activeButton");
});

locationButton.addEventListener("click", () => {
  const isOpen = locationMenu.style.display === "block";
  locationMenu.style.display = isOpen ? "none" : "block";

  toolsMenu.style.display = "none";
  hospitalMenu.style.display = "none";

  locationButton.classList.toggle("activeButton", !isOpen);
  toolsButton.classList.remove("activeButton");
  hospitalButton.classList.remove("activeButton");
});

/* Close menus when clicking outside */
document.addEventListener("click", (e) => {
  if (!toolsButton.contains(e.target)) toolsMenu.style.display = "none";
  if (!hospitalButton.contains(e.target)) hospitalMenu.style.display = "none";
  if (!locationButton.contains(e.target)) locationMenu.style.display = "none";
});

/* ------------------------------
   6. IFRAME LOAD + TIMESTAMP
   ------------------------------ */
iframe.onload = () => {
  loadingSpinner.style.display = "none";
  updateTimestamp();
};

function loadIframeForHospital(name) {
  loadingSpinner.style.display = "block";

  if (name === "TWH") iframe.src = config.twTable;
  if (name === "MGH") iframe.src = config.mghTable;

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
  if (hospital === "Tunbridge Wells") loadIframeForHospital("TWH");
  if (hospital === "Maidstone") loadIframeForHospital("MGH");

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
  hospitalMenu.style.display = "none";

  if (name === "Tunbridge Wells") loadIframeForHospital("TWH");
  if (name === "Maidstone") loadIframeForHospital("MGH");
}

function selectLocation(name) {
  activeLocation.textContent = name;
  locationMenu.style.display = "none";
}

/* ------------------------------
   9. REFRESH LOGIC
   ------------------------------ */
function manualRefresh() {
  if (activeToolLabel.textContent !== "Tracking Board") return;

  loadingSpinner.style.display = "block";

  const base = iframe.src.split("?")[0];
  const params = iframe.src.split("?")[1];

  iframe.src = `${base}?${params}&manual=${Date.now()}`;
}

/* Auto-refresh every 5 minutes */
setInterval(() => {
  if (activeToolLabel.textContent !== "Tracking Board") return;

  loadingSpinner.style.display = "block";

  const base = iframe.src.split("?")[0];
  const params = iframe.src.split("?")[1];

  iframe.src = `${base}?${params}&auto=${Date.now()}`;
}, 300000);

/* ------------------------------
   10. TIMESTAMP UPDATE
   ------------------------------ */
function updateTimestamp() {
  timestamp.textContent =
    "Last refreshed at " +
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
}

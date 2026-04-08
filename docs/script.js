/* =========================================================
   FINDPATIENT — CLEAN, CONFIG‑DRIVEN REWRITE
   ========================================================= */

/* ------------------------------
   0. CONFIG REFERENCE
   ------------------------------ */

const cfg = window.findpatientConfig;

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

const footerAuthor = document.getElementById("footerAuthor");
const appVersion = document.getElementById("appVersion");

/* ------------------------------
   2. STATE
   ------------------------------ */

let currentHospitalKey = null;
let currentLocationName = null;
let currentToolKey = "tracking";

/* ------------------------------
   3. INITIALISE APP TITLE + VERSION
   ------------------------------ */

document.getElementById("dynamicTitle").textContent = cfg.trust.appTitle;
document.querySelectorAll(".appTitle").forEach(el => {
  el.textContent = cfg.trust.appTitle;
});

appVersion.textContent = `${cfg.trust.code} ${cfg.trust.version}`;

/* ------------------------------
   4. MOBILE DETECTION
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

    timestamp.style.display = "none";

    buildMobileMenu();
    buildMobileHospitalSelector();
  } else {
    desktopContainer.style.display = "block";
    mobileContainer.style.display = "none";
  }
});

/* ------------------------------
   5. BUILD TOOLS MENU
   ------------------------------ */

function buildToolsMenu() {
  toolsMenu.innerHTML = "";

  cfg.tools.forEach(tool => {
    if (!tool.enabled) return;

    const item = document.createElement("div");
    item.textContent = tool.label;
    item.dataset.toolKey = tool.key;

    item.onclick = () => {
      if (tool.type === "action") {
        manualRefresh();
      } else {
        selectTool(tool.key);
      }
    };

    toolsMenu.appendChild(item);
  });
}


/* ------------------------------
   6. BUILD HOSPITAL MENU
   ------------------------------ */

function buildHospitalMenu() {
  hospitalMenu.innerHTML = "";

  Object.entries(cfg.hospitals).forEach(([key, hospital]) => {
    const item = document.createElement("div");
    item.textContent = hospital.name;
    item.dataset.hospitalKey = key;

    item.onclick = () => selectHospital(key);

    hospitalMenu.appendChild(item);
  });
}

/* ------------------------------
   7. BUILD LOCATION MENU
   ------------------------------ */

function buildLocationMenu(hospitalKey) {
  locationMenu.innerHTML = "";

  const hospital = cfg.hospitals[hospitalKey];
  if (!hospital) return;

  hospital.locations.forEach(loc => {
    const item = document.createElement("div");
    item.textContent = loc.name;

    if (!loc.enabled) {
      item.style.opacity = "0.4";
      item.style.pointerEvents = "none";
    } else {
      item.onclick = () => selectLocation(loc.name);
    }

    locationMenu.appendChild(item);
  });
}

/* ------------------------------
   8. SELECT TOOL
   ------------------------------ */

function selectTool(toolKey) {
  currentToolKey = toolKey;

  const tool = cfg.tools.find(t => t.key === toolKey);
  if (!tool) return;

  // Refresh is an action, not a view
  if (tool.type === "action") {
    manualRefresh();
    return;
  }

  activeToolLabel.textContent = tool.label;

  toolsMenu.querySelectorAll("div").forEach(div => {
    div.classList.toggle("active", div.dataset.toolKey === toolKey);
  });

  if (toolKey === "tracking") {
    selectorBar.style.display = "flex";
    loadTrackingBoard();
  } else {
    selectorBar.style.display = "none";
    loadToolIframe(toolKey);
  }
}

/* ------------------------------
   9. SELECT HOSPITAL
   ------------------------------ */

function selectHospital(hospitalKey) {
  currentHospitalKey = hospitalKey;

  const hospital = cfg.hospitals[hospitalKey];
  activeHospital.textContent = hospital.name;

  buildLocationMenu(hospitalKey);

  // Default to first enabled location
  const firstEnabled = hospital.locations.find(l => l.enabled);
  if (firstEnabled) selectLocation(firstEnabled.name);

  if (currentToolKey === "tracking") loadTrackingBoard();
}

/* ------------------------------
   10. SELECT LOCATION
   ------------------------------ */

function selectLocation(locationName) {
  currentLocationName = locationName;
  activeLocation.textContent = locationName;

  if (currentToolKey === "tracking") loadTrackingBoard();
}

/* ------------------------------
   11. LOAD TRACKING BOARD
   ------------------------------ */

function loadTrackingBoard() {
  if (!currentHospitalKey || !currentLocationName) return;

  const url = cfg.dashboards[currentHospitalKey][currentLocationName];
  loadIframe(url, true);
}

/* ------------------------------
   12. LOAD OTHER TOOLS
   ------------------------------ */

function loadToolIframe(toolKey) {
  const url = cfg.toolUrls[toolKey];
  loadIframe(url, false);
}

/* ------------------------------
   13. IFRAME LOADING + TIMESTAMP
   ------------------------------ */

function loadIframe(url, isTracking) {
  loadingSpinner.style.display = "block";

  iframe.classList.toggle("iframeTracking", isTracking);
  iframe.classList.toggle("iframeForm", !isTracking);

  iframe.src = `${url}?t=${Date.now()}`;

  iframe.onload = () => {
    loadingSpinner.style.display = "none";
    updateTimestamp();
  };
}

function updateTimestamp() {
  timestamp.textContent =
    "Last refreshed at " +
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/* ------------------------------
   14. AUTO REFRESH (TRACKING ONLY)
   ------------------------------ */

setInterval(() => {
  if (currentToolKey !== "tracking") return;
  loadTrackingBoard();
}, 300000);

/* ------------------------------
   15. MANUAL REFRESH
   ------------------------------ */

function manualRefresh() {
  if (currentToolKey !== "tracking") return;

  activeToolLabel.classList.add("refreshing");
  activeToolLabel.textContent = "Refreshing…";

  loadTrackingBoard();

  setTimeout(() => {
    activeToolLabel.classList.remove("refreshing");
    activeToolLabel.textContent = "Tracking Board";
  }, 800);
}

/* ------------------------------
   16. MOBILE VERSION
   ------------------------------ */

function buildMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.innerHTML = "";

  cfg.tools.forEach(tool => {
    if (!tool.enabled) return;

    const btn = document.createElement("button");
    btn.className = "hospitalButton";
    btn.textContent = tool.label;

    btn.onclick = () => {
      window.location.href = cfg.toolUrls[tool.key];
    };

    menu.appendChild(btn);
  });
}

function buildMobileHospitalSelector() {
  const container = document.getElementById("hospitalSelector");
  container.innerHTML = "<h2>Select Hospital</h2>";

  Object.entries(cfg.hospitals).forEach(([key, hospital]) => {
    const btn = document.createElement("button");
    btn.className = "hospitalButton";
    btn.textContent = hospital.name;

    btn.onclick = () => {
      const url = cfg.dashboards[key]["Whole Dept"];
      window.location.href = url;
    };

    container.appendChild(btn);
  });

  const back = document.createElement("div");
  back.className = "backLink";
  back.textContent = "← Back";
  back.onclick = () => {
    container.style.display = "none";
    document.getElementById("mobileMenu").style.display = "block";
  };

  container.appendChild(back);
}

/* ------------------------------
   17. DROPDOWN ENGINE (UNCHANGED)
   ------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  const triggers = document.querySelectorAll(".dropdownTrigger");

  triggers.forEach(trigger => {
    trigger.addEventListener("click", e => {
      e.stopPropagation();

      document.querySelectorAll(".dropdownList.open").forEach(menu => {
        if (!trigger.contains(menu)) menu.classList.remove("open");
      });

      const menu = trigger.querySelector(".dropdownList");
      if (menu) menu.classList.toggle("open");
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".dropdownList.open").forEach(menu => {
      menu.classList.remove("open");
    });
  });
});

/* ------------------------------
   18. INITIALISE EVERYTHING
   ------------------------------ */

window.addEventListener("DOMContentLoaded", () => {
  footerAuthor.textContent = cfg.trust.name;

  buildToolsMenu();
  buildHospitalMenu();

  // Default hospital = first in config
  const firstHospitalKey = Object.keys(cfg.hospitals)[0];
  selectHospital(firstHospitalKey);

  // Default tool = tracking
  selectTool("tracking");
});

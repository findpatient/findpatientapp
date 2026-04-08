window.findpatientConfig = {
  trust: {
    code: "DUMMY",
    name: "Dummy NHS Trust",
    appTitle: "ED Downtime Tracking Tool (Demo)",
    version: "v0.0.1"
  },

  tools: [
    { key: "tracking", label: "Tracking Board", type: "iframe", enabled: true },
    { key: "addPatient", label: "Add Patient", type: "iframe", enabled: true },

    // NEW: Refresh as an action tool
    { key: "refresh", label: "Refresh", type: "action", enabled: true },

    { key: "discharged", label: "Discharged Patients", type: "iframe", enabled: true },
    { key: "management", label: "Management View", type: "iframe", enabled: false },
    { key: "metrics", label: "Metrics", type: "iframe", enabled: false }
  ],

  hospitals: {
    hospital1: {
      code: "HOSP1",
      name: "Demo Hospital One",
      locations: [
        { name: "Whole Dept", enabled: true },
        { name: "Majors", enabled: true },
        { name: "Minors", enabled: true },
        { name: "Paeds ED", enabled: true },
        { name: "RAP", enabled: false },
        { name: "Resus", enabled: false }
      ]
    },

    hospital2: {
      code: "HOSP2",
      name: "Demo Hospital Two",
      locations: [
        { name: "Whole Dept", enabled: true },
        { name: "Majors", enabled: true },
        { name: "Minors", enabled: false },
        { name: "Paeds ED", enabled: false },
        { name: "Clinics", enabled: false }
      ]
    }
  },

  dashboards: {
    hospital1: {
      "Whole Dept": "about:blank",
      "Majors": "about:blank",
      "Minors": "about:blank",
      "Paeds ED": "about:blank",
      "RAP": "about:blank",
      "Resus": "about:blank"
    },

    hospital2: {
      "Whole Dept": "about:blank",
      "Majors": "about:blank",
      "Minors": "about:blank",
      "Paeds ED": "about:blank",
      "Clinics": "about:blank"
    }
  },

  toolUrls: {
    tracking: "https://example.com",
    addPatient: "https://example.com/form",
    discharged: "https://example.com/discharged",
    management: "https://example.com/management",
    metrics: "https://example.com/metrics"
  }
};


/*
window.findpatientConfig = {
  trust: {
    code: "RWF",
    name: "Maidstone & Tunbridge Wells",
    appTitle: "ED Downtime Tracking Tool",
    version: "v1.0.0"
  },

  tools: [
    { key: "tracking", label: "Tracking Board", type: "iframe", enabled: true },
    { key: "addPatient", label: "Add Patient", type: "iframe", enabled: true },
    { key: "discharged", label: "Discharged Patients", type: "iframe", enabled: false },
    { key: "management", label: "Management View", type: "iframe", enabled: false },
    { key: "metrics", label: "Metrics", type: "iframe", enabled: false }
  ],

  hospitals: {
    hospital1: {
      code: "TWH",
      name: "Tunbridge Wells Hospital",
      locations: [
        { name: "Whole Dept", enabled: true },
        { name: "Majors", enabled: true },
        { name: "Minors", enabled: true },
        { name: "Paeds ED", enabled: true },
        { name: "RAP", enabled: false },
        { name: "Resus", enabled: false },
        { name: "Clinics", enabled: false },
        { name: "CDU", enabled: false }
      ]
    },

    hospital2: {
      code: "MGH",
      name: "Maidstone Hospital",
      locations: [
        { name: "Whole Dept", enabled: true },
        { name: "Majors", enabled: true },
        { name: "Minors", enabled: true },
        { name: "Paeds ED", enabled: true },
        { name: "RAP", enabled: false },
        { name: "Resus", enabled: false },
        { name: "Clinics", enabled: false },
        { name: "CDU", enabled: false }
      ]
    }
  },

  dashboards: {
    hospital1: {
      "Whole Dept": "URL1",
      "Majors": "URL2",
      "Minors": "URL3",
      "Paeds ED": "URL4",
      "RAP": "URL5",
      "Resus": "URL6",
      "Clinics": "URL7",
      "CDU": "URL8"
    },

    hospital2: {
      "Whole Dept": "URL9",
      "Majors": "URL10",
      "Minors": "URL11",
      "Paeds ED": "URL12",
      "RAP": "URL13",
      "Resus": "URL14",
      "Clinics": "URL15",
      "CDU": "URL16"
    }
  },

  toolUrls: {
    tracking: "URL_TRACKING",
    addPatient: "URL_FORM",
    discharged: "URL_DISCHARGED",
    management: "URL_MANAGEMENT",
    metrics: "URL_METRICS"
  }
};
*/

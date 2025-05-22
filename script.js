
const SUPABASE_URL = "https://qodjghrxucatvgvamdvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZGpnaHJ4dWNhdHZndmFtZHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzM0NTYsImV4cCI6MjA2MzQwOTQ1Nn0.DpMR66cpC57FCWA2Cs-drgOKuvjmBnTqarg2KPDWHcw";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let aktuellesMedikament = null;
let intervallInStunden = 6;

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Login fehlgeschlagen: " + error.message);
    return;
  }
  document.getElementById("login-section").style.display = "none";
  document.getElementById("main-section").style.display = "block";
  filterMeds();
};

window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert("Registrierung fehlgeschlagen: " + error.message);
    return;
  }
  alert("Registrierung erfolgreich! Bitte E-Mail-Adresse bestätigen.");
};


window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Login fehlgeschlagen: " + error.message);
    return;
  }
  document.getElementById("login-section").style.display = "none";
  document.getElementById("main-section").style.display = "block";
  filterMeds();
};

window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    alert("Registrierung fehlgeschlagen: " + error.message);
    return;
  }
  alert("Registrierung erfolgreich! Bitte E-Mail-Adresse bestätigen.");
};

const medikamente = [
  {
    "name": "Ibuprofen 400",
    "wirkstoff": "Ibuprofen",
    "standarddosierung": "400 mg alle 6–8 Stunden",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 400,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit Nahrung einnehmen.",
    "nahrung": "Vermeide Alkohol.",
    "wechselwirkungen": "Blutverdünner, Kortison.",
    "nebenwirkungen": "Magenbeschwerden, Schwindel.",
    "einnahmeart": "schlucken",
    "dosisintervall": "6",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "3 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Paracetamol Zäpfchen",
    "wirkstoff": "Paracetamol",
    "standarddosierung": "125 mg alle 6–8 Stunden",
    "einheit": "Zäpfchen",
    "wirkstoff_pro_einheit": 125,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Rektal verabreichen.",
    "nahrung": "Keine",
    "wechselwirkungen": "Leberenzyme-induzierende Medikamente",
    "nebenwirkungen": "Lebertoxizität",
    "einnahmeart": "rektal",
    "dosisintervall": "6",
    "kategorie": "Kinder",
    "max_einnahmedauer": "3 Tage"
  },
  {
    "name": "Diclofenac",
    "wirkstoff": "Diclofenac",
    "standarddosierung": "50 mg 2–3× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Nach dem Essen mit Wasser.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Blutverdünner, Diuretika",
    "nebenwirkungen": "Magenreizung",
    "einnahmeart": "schlucken",
    "dosisintervall": "8",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "5 Tage"
  },
  {
    "name": "Ambroxol",
    "wirkstoff": "Ambroxol",
    "standarddosierung": "30 mg 2–3× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 30,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nach dem Essen.",
    "nahrung": "Keine",
    "wechselwirkungen": "Antitussiva",
    "nebenwirkungen": "Übelkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "8",
    "kategorie": "Husten",
    "max_einnahmedauer": "5 Tage"
  },
  {
    "name": "Metamizol",
    "wirkstoff": "Metamizol",
    "standarddosierung": "500 mg 3× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine",
    "wechselwirkungen": "Blutdrucksenker",
    "nebenwirkungen": "Kreislaufprobleme",
    "einnahmeart": "schlucken",
    "dosisintervall": "8",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "nach Anweisung"
  },
  {
    "name": "Aspirin 500",
    "wirkstoff": "Acetylsalicylsäure",
    "standarddosierung": "1–2 Tabletten (500–1000 mg), max. 6 Tabletten täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nach dem Essen mit Wasser einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Blutverdünner, NSAIDs",
    "nebenwirkungen": "Magenblutungen, Übelkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "6",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "3–5 Tage"
  },
  {
    "name": "Ibuprofen 500",
    "wirkstoff": "Ibuprofen",
    "standarddosierung": "1 Tablette (500 mg), max. 1200–2400 mg/Tag je nach Alter",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit oder nach dem Essen einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Blutverdünner, Kortison",
    "nebenwirkungen": "Magenbeschwerden",
    "einnahmeart": "schlucken",
    "dosisintervall": "6",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "3 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Paracetamol 500",
    "wirkstoff": "Paracetamol",
    "standarddosierung": "1 Tablette (500 mg), max. 4.000 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit Wasser einnehmen, nüchtern oder nach dem Essen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Leberenzyme-induzierende Medikamente",
    "nebenwirkungen": "Lebertoxizität bei Überdosierung",
    "einnahmeart": "schlucken",
    "dosisintervall": "6",
    "kategorie": "Schmerzmittel/Fieber",
    "max_einnahmedauer": "3 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Omeprazol 20",
    "wirkstoff": "Omeprazol",
    "standarddosierung": "20 mg einmal täglich, ggf. anpassen auf 10–40 mg",
    "einheit": "Kapsel",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Ca. 1 Stunde vor dem Essen mit Wasser einnehmen.",
    "nahrung": "Nicht mit Milchprodukten kombinieren.",
    "wechselwirkungen": "Clopidogrel, Diazepam",
    "nebenwirkungen": "Kopfschmerzen, Übelkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "24",
    "kategorie": "Magen",
    "max_einnahmedauer": "2–8 Wochen"
  },
  {
    "name": "Metformin 500",
    "wirkstoff": "Metformin",
    "standarddosierung": "500 mg 2–3× täglich, max. 3000 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Zu den Mahlzeiten einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Kontrastmittel, Diuretika",
    "nebenwirkungen": "Magen-Darm-Beschwerden",
    "einnahmeart": "schlucken",
    "dosisintervall": "12",
    "kategorie": "Diabetes",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "ACC Kindersaft",
    "wirkstoff": "Acetylcystein",
    "standarddosierung": "Je nach Alter 5–10 ml, 2–3× täglich",
    "einheit": "Saft",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 5,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nach den Mahlzeiten einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Hustenstiller, Antibiotika",
    "nebenwirkungen": "Magenbeschwerden, selten allergische Reaktionen",
    "einnahmeart": "schlucken",
    "dosisintervall": "8",
    "kategorie": "Husten",
    "max_einnahmedauer": "5 Tage ohne ärztlichen Rat"
  },
  {
    "name": "Ambroxol Saft",
    "wirkstoff": "Ambroxol",
    "standarddosierung": "15–45 mg je nach Alter aufgeteilt in 2–3 Dosen",
    "einheit": "Saft",
    "wirkstoff_pro_einheit": 15,
    "einheit_menge": 5,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nach den Mahlzeiten einnehmen.",
    "nahrung": "Keine Einschränkungen.",
    "wechselwirkungen": "Keine signifikanten",
    "nebenwirkungen": "Übelkeit, Taubheitsgefühl im Mund/Rachen",
    "einnahmeart": "schlucken",
    "dosisintervall": "8",
    "kategorie": "Husten",
    "max_einnahmedauer": "5 Tage ohne ärztlichen Rat"
  },
  {
    "name": "Amoxicillin 500",
    "wirkstoff": "Amoxicillin",
    "standarddosierung": "250–500 mg alle 8 Stunden, bei schweren Infektionen 750–1000 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Kurz vor einer Mahlzeit einnehmen.",
    "nahrung": "Nicht mit Milch einnehmen.",
    "wechselwirkungen": "Methotrexat, Allopurinol",
    "nebenwirkungen": "Durchfall, allergische Reaktionen",
    "einnahmeart": "schlucken",
    "dosisintervall": "8",
    "kategorie": "Antibiotikum",
    "max_einnahmedauer": "je nach Infektion, in der Regel 5–10 Tage"
  },
  {
    "name": "Ibuprofen",
    "wirkstoff": "Ibuprofen",
    "standarddosierung": "400 mg",
    "max_tagesdosis": "1200 mg",
    "hinweise": "Nach dem Essen, mit Wasser",
    "nahrung": "Alkohol",
    "wechselwirkungen": "Blutverduenner, SSRI",
    "nebenwirkungen": "Magenbeschwerden",
    "einnahmeart": "schlucken",
    "dosisintervall": "6-8",
    "kategorie": "Schmerzen",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 400,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  },
  {
    "name": "Paracetamol",
    "wirkstoff": "Paracetamol",
    "standarddosierung": "500 mg",
    "max_tagesdosis": "4000 mg",
    "hinweise": "Mit Wasser, nuechtern oder nach dem Essen",
    "nahrung": "Alkohol",
    "wechselwirkungen": "Leberenzyme-induzierende Medikamente",
    "nebenwirkungen": "Lebertoxizitaet",
    "einnahmeart": "schlucken",
    "dosisintervall": "4-6",
    "kategorie": "Schmerzen/Fieber",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  },
  {
    "name": "Aspirin",
    "wirkstoff": "Acetylsalicylsaeure",
    "standarddosierung": "100 mg",
    "max_tagesdosis": "3000 mg",
    "hinweise": "Mit Wasser, nach dem Essen",
    "nahrung": "Alkohol",
    "wechselwirkungen": "Blutverduenner, NSAIDs",
    "nebenwirkungen": "Magenblutungen",
    "einnahmeart": "schlucken",
    "dosisintervall": "8",
    "kategorie": "Schmerzen",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  },
  {
    "name": "Omeprazol",
    "wirkstoff": "Omeprazol",
    "standarddosierung": "20 mg",
    "max_tagesdosis": "40 mg",
    "hinweise": "Morgens nuechtern",
    "nahrung": "Grapefruit",
    "wechselwirkungen": "Clopidogrel, Diazepam",
    "nebenwirkungen": "Kopfschmerzen",
    "einnahmeart": "schlucken",
    "dosisintervall": "24",
    "kategorie": "Magen",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  },
  {
    "name": "Metformin",
    "wirkstoff": "Metformin",
    "standarddosierung": "500 mg",
    "max_tagesdosis": "2000 mg",
    "hinweise": "Zum Essen",
    "nahrung": "Alkohol",
    "wechselwirkungen": "Kontrastmittel, Diuretika",
    "nebenwirkungen": "Magendarmbeschwerden",
    "einnahmeart": "schlucken",
    "dosisintervall": "12",
    "kategorie": "Diabetes",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  },
  {
    "name": "Amoxicillin",
    "wirkstoff": "Amoxicillin",
    "standarddosierung": "500 mg",
    "max_tagesdosis": "3000 mg",
    "hinweise": "Mit Wasser, gleichmaessig ueber den Tag",
    "nahrung": "Milchprodukte",
    "wechselwirkungen": "Methotrexat, Allopurinol",
    "nebenwirkungen": "Durchfall",
    "einnahmeart": "schlucken",
    "dosisintervall": "8",
    "kategorie": "Antibiotika",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  },
  {
    "name": "Pantoprazol",
    "wirkstoff": "Pantoprazol",
    "standarddosierung": "40 mg",
    "max_tagesdosis": "80 mg",
    "hinweise": "Vor dem Essen",
    "nahrung": "Grapefruit",
    "wechselwirkungen": "Atazanavir, Ketoconazol",
    "nebenwirkungen": "Schwindel",
    "einnahmeart": "schlucken",
    "dosisintervall": "24",
    "kategorie": "Magen",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 40,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  },
  {
    "name": "Simvastatin",
    "wirkstoff": "Simvastatin",
    "standarddosierung": "20 mg",
    "max_tagesdosis": "40 mg",
    "hinweise": "Abends",
    "nahrung": "Grapefruit",
    "wechselwirkungen": "CYP3A4-Hemmer",
    "nebenwirkungen": "Muskelschmerzen",
    "einnahmeart": "schlucken",
    "dosisintervall": "24",
    "kategorie": "Cholesterin",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  },
  {
    "name": "Levothyroxin",
    "wirkstoff": "Levothyroxin",
    "standarddosierung": "50 µg",
    "max_tagesdosis": "200 µg",
    "hinweise": "Morgens nuechtern",
    "nahrung": "Soja",
    "wechselwirkungen": "Eisenpraeparate, Kalzium",
    "nebenwirkungen": "Herzrasen",
    "einnahmeart": "schlucken",
    "dosisintervall": "24",
    "kategorie": "Schilddruese",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  },
  {
    "name": "Diclofenac",
    "wirkstoff": "Diclofenac",
    "standarddosierung": "50 mg",
    "max_tagesdosis": "150 mg",
    "hinweise": "Nach dem Essen, mit Wasser",
    "nahrung": "Alkohol",
    "wechselwirkungen": "Blutverduenner, Diuretika",
    "nebenwirkungen": "Magenreizung",
    "einnahmeart": "schlucken",
    "dosisintervall": "8",
    "kategorie": "Schmerzen",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ]
  }
];

window.filterMeds = function () {
  const search = document.getElementById("search-med").value.toLowerCase();
  const dropdown = document.getElementById("med-dropdown");
  dropdown.innerHTML = "";
  medikamente
    .filter(m => m.name.toLowerCase().includes(search))
    .forEach(med => {
      const option = document.createElement("option");
      option.value = med.name;
      option.textContent = med.name;
      dropdown.appendChild(option);
    });
};


window.calculateDosage = function () {
  const medName = document.getElementById("med-dropdown").value;
  const weight = parseFloat(document.getElementById("weight").value);
  const age = parseInt(document.getElementById("age").value);
  const med = medikamente.find(m => m.name === medName);
  aktuellesMedikament = med;

  let dosierung = med.standarddosierung;
  let zusatz = "";

  if (med.wirkstoff.toLowerCase().includes("ibuprofen") && !isNaN(weight)) {
    if (weight >= 20 && weight <= 29) {
      dosierung = "½ Tablette (200 mg)";
      zusatz = " max. 1½ Tabletten (600 mg) pro Tag";
    } else if (weight >= 30 && weight <= 39) {
      dosierung = "½ Tablette (200 mg)";
      zusatz = " max. 2 Tabletten (800 mg) pro Tag";
    } else if (weight >= 40) {
      dosierung = "½ bis 1 Tablette (200–400 mg)";
      zusatz = " max. 3 Tabletten (1200 mg) pro Tag";
    } else {
      dosierung = "Nicht empfohlen für < 20 kg";
    }
  } else if (med.wirkstoff.toLowerCase().includes("paracetamol") && med.wirkstoff_pro_einheit === 500 && !isNaN(weight)) {
    if (weight >= 17 && weight <= 25) {
      dosierung = "½ Tablette (250 mg)";
      zusatz = " max. 2 Tabletten (1000 mg) pro Tag";
    } else if (weight >= 26 && weight <= 32) {
      dosierung = "½ Tablette (250 mg)";
      zusatz = " max. 2–3 Tabletten (1000–1500 mg) pro Tag";
    } else if (weight >= 33 && weight <= 43) {
      dosierung = "1 Tablette (500 mg)";
      zusatz = " max. 4 Tabletten (2000 mg) pro Tag";
    } else if (weight > 43) {
      dosierung = "1–2 Tabletten (500–1000 mg)";
      zusatz = " max. 8 Tabletten (4000 mg) pro Tag";
    } else {
      dosierung = "Nicht empfohlen für < 17 kg";
    }
  } else if (med.wirkstoff.toLowerCase().includes("acetylsalicylsäure") && !isNaN(age)) {
    if (age >= 12 && age <= 15 && weight >= 40 && weight <= 50) {
      dosierung = "1 Tablette (500 mg)";
      zusatz = " max. 6 Tabletten (3000 mg) pro Tag";
    } else if (age >= 16 && age < 65) {
      dosierung = "1–2 Tabletten (500–1000 mg)";
      zusatz = " max. 6 Tabletten (3000 mg) pro Tag";
    } else if (age >= 65) {
      dosierung = "1 Tablette (500 mg)";
      zusatz = " max. 4 Tabletten (2000 mg) pro Tag";
    } else {
      dosierung = "Nicht empfohlen für Kinder unter 12 Jahren";
    }
  } else if (med.wirkstoff.toLowerCase().includes("omeprazol") && !isNaN(weight) && !isNaN(age)) {
    if (age < 1 && weight >= 10 && weight <= 20) {
      dosierung = "10 mg täglich";
      zusatz = " max. 20 mg pro Tag";
    } else if (age >= 1 && weight > 20 && age < 4) {
      dosierung = "20 mg täglich";
      zusatz = " max. 40 mg pro Tag";
    } else if (age >= 4 && weight >= 15 && weight <= 30) {
      dosierung = "10 mg täglich (mit Antibiotika)";
    } else if (age >= 4 && weight > 30) {
      dosierung = "20 mg täglich (mit Antibiotika)";
    } else if (age >= 18) {
      dosierung = "20 mg täglich, ggf. anpassen";
      zusatz = " 10–40 mg üblich, bis zu 120 mg";
    }
  } else if (med.wirkstoff.toLowerCase().includes("metformin") && !isNaN(age)) {
    if (age >= 10 && age < 18) {
      dosierung = "500–850 mg 1× täglich";
      zusatz = " max. 2000 mg/Tag in 2–3 Dosen";
    } else if (age >= 18) {
      dosierung = "500–850 mg 2–3× täglich";
      zusatz = " max. 3000 mg/Tag";
    }
  }

  document.getElementById("empf-dosierung").textContent = dosierung + zusatz;
  document.getElementById("wirkstoff").textContent = med.wirkstoff;
  document.getElementById("std-dosierung").textContent = med.standarddosierung;
  document.getElementById("hinweise").textContent = med.hinweise;
  document.getElementById("nahrung").textContent = med.nahrung;
  document.getElementById("wechselwirkungen").textContent = med.wechselwirkungen;
  document.getElementById("nebenwirkungen").textContent = med.nebenwirkungen;
  document.getElementById("einnahmeart").textContent = med.einnahmeart;
  document.getElementById("dosisintervall").textContent = med.dosisintervall;
  document.getElementById("kategorie").textContent = med.kategorie;
  document.getElementById("max-einnahmedauer").textContent = med.max_einnahmedauer;
  else if (med.wirkstoff.toLowerCase().includes("acetylcystein") && !isNaN(age)) {
      if (age >= 2 && age <= 5) {
        dosierung = "5 ml 2–3× täglich";
        zusatz = " = 200–300 mg/Tag";
      } else if (age >= 6 && age <= 14) {
        dosierung = "10 ml 2× täglich";
        zusatz = " = 400 mg/Tag";
      } else if (age >= 15) {
        dosierung = "10 ml 3× täglich";
        zusatz = " = 600 mg/Tag";
      } else {
        dosierung = "Nicht empfohlen für < 2 Jahre";
      }
    }
    else if (med.wirkstoff.toLowerCase().includes("ambroxol") && !isNaN(age)) {
      if (age < 2) {
        dosierung = "15 mg/Tag in 2 Dosen";
      } else if (age >= 2 && age <= 5) {
        dosierung = "22,5 mg/Tag in 2 Dosen";
      } else if (age >= 6 && age < 12) {
        dosierung = "30–45 mg/Tag in 2–3 Dosen";
      } else if (age >= 12) {
        dosierung = "Erst 90 mg/Tag (2–3 Dosen), dann 60 mg/Tag in 2 Dosen";
      }
    }
    else if (med.wirkstoff.toLowerCase().includes("amoxicillin") && !isNaN(weight)) {
      if (weight < 40) {
        dosierung = "Dosis muss individuell nach Gewicht angepasst werden (< 40 kg)";
      } else {
        dosierung = "250–500 mg alle 8 Stunden, ggf. 750–1000 mg bei schweren Infektionen";
      }
    }
    
  } else if (med.wirkstoff.toLowerCase().includes("acetylcystein") && !isNaN(age)) {
    if (age >= 2 && age <= 5) {
      dosierung = "5 ml 2–3× täglich";
      zusatz = " = 200–300 mg/Tag";
    } else if (age >= 6 && age <= 14) {
      dosierung = "10 ml 2× täglich";
      zusatz = " = 400 mg/Tag";
    } else if (age >= 15) {
      dosierung = "10 ml 3× täglich";
      zusatz = " = 600 mg/Tag";
    } else {
      dosierung = "Nicht empfohlen für < 2 Jahre";
    }
  } else if (med.wirkstoff.toLowerCase().includes("ambroxol") && !isNaN(age)) {
    if (age < 2) {
      dosierung = "15 mg/Tag in 2 Dosen";
    } else if (age >= 2 && age <= 5) {
      dosierung = "22,5 mg/Tag in 2 Dosen";
    } else if (age >= 6 && age < 12) {
      dosierung = "30–45 mg/Tag in 2–3 Dosen";
    } else if (age >= 12) {
      dosierung = "Erst 90 mg/Tag (2–3 Dosen), dann 60 mg/Tag in 2 Dosen";
    }
  } else if (med.wirkstoff.toLowerCase().includes("amoxicillin") && !isNaN(weight)) {
    if (weight < 40) {
      dosierung = "Dosis muss individuell nach Gewicht angepasst werden (< 40 kg)";
    } else {
      dosierung = "250–500 mg alle 8 Stunden, ggf. 750–1000 mg bei schweren Infektionen";
    }
  }

  document.getElementById("reminder-hinweis").textContent =
    "Hinweis: Die Dosierungsanzeige ist vereinfacht und ersetzt keine ärztliche Beratung.";
};


window.confirmIntake = async function () {
  const jetzt = new Date();
  const stdIntervall = parseInt(aktuellesMedikament.dosisintervall) || 6;
  const naechsteEinnahme = new Date(jetzt.getTime() + (stdIntervall - 1) * 60 * 60 * 1000);
  const uhrzeit = naechsteEinnahme.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("reminder-status").textContent = `Du wirst um ${uhrzeit} an die nächste Einnahme erinnert.`;

  const { data, error } = await supabase.auth.getUser();
  if (!data?.user) return alert('Nicht eingeloggt.');
  const email = data.user.email;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reminders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY
      },
      body: JSON.stringify({
        user_id: data.user.id,
        user_email: email,
        med_name: aktuellesMedikament.name,
        next_time: naechsteEinnahme.toISOString(),
        interval_h: stdIntervall,
        reminded: false
      })
    });

    if (!response.ok) throw new Error("Fehler beim Speichern des Reminders.");
    document.getElementById("reminder-feedback").textContent = "Erinnerung erfolgreich gespeichert.";
  } catch (error) {
    console.error(error);
    document.getElementById("reminder-feedback").textContent = "Fehler beim Speichern der Erinnerung.";
  }
};

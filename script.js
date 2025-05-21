
const SUPABASE_URL = "https://qodjghrxucatvgvamdvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZGpnaHJ4dWNhdHZndmFtZHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzM0NTYsImV4cCI6MjA2MzQwOTQ1Nn0.DpMR66cpC57FCWA2Cs-drgOKuvjmBnTqarg2KPDWHcw";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
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
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    alert("Registrierung fehlgeschlagen: " + error.message);
    return;
  }
  alert("Registrierung erfolgreich! Bitte E-Mail-Adresse bestätigen.");
};

let aktuellesMedikament = null;
let intervallInStunden = 0;

const medikamente = [
  {
    "name": "ASS 100",
    "wirkstoff": "Acetylsalicylsäure",
    "standarddosierung": "1 Tablette (100 mg) täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Unzerkaut mit viel Wasser einnehmen.",
    "nahrung": "Nicht auf nüchternen Magen einnehmen.",
    "wechselwirkungen": "Blutverdünner, Ibuprofen, Kortisonpräparate",
    "nebenwirkungen": "Magenreizungen, Blutungsneigung",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Blutverdünner",
    "max_einnahmedauer": "Dauertherapie nach ärztlicher Anweisung"
  },
  {
    "name": "L-Thyroxin 50",
    "wirkstoff": "Levothyroxin",
    "standarddosierung": "1 Tablette (50 µg) täglich morgens nüchtern",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens nüchtern mind. 30 Minuten vor dem Frühstück einnehmen.",
    "nahrung": "Kalziumhaltige Produkte (Milch) vermeiden kurz nach Einnahme.",
    "wechselwirkungen": "Eisenpräparate, Antazida, Kalzium",
    "nebenwirkungen": "Herzrasen, Schwitzen, Schlaflosigkeit bei Überdosierung",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Schilddrüsenhormon",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Sinupret forte",
    "wirkstoff": "Pflanzliche Kombination (Enzianwurzel, Eisenkraut, Holunder, Primel)",
    "standarddosierung": "3× täglich 1 Tablette",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 0,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit etwas Wasser unzerkaut einnehmen.",
    "nahrung": "Unabhängig von Mahlzeiten möglich.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Gelegentlich Magenbeschwerden",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Pflanzliches Erkältungsmittel",
    "max_einnahmedauer": "7–14 Tage"
  },
  {
    "name": "Voltaren Schmerzgel",
    "wirkstoff": "Diclofenac",
    "standarddosierung": "2–3× täglich auftragen",
    "einheit": "Gel",
    "wirkstoff_pro_einheit": 11.6,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nur äußerlich anwenden. Nicht auf offene Wunden.",
    "nahrung": "Nicht relevant.",
    "wechselwirkungen": "Keine bei äußerlicher Anwendung",
    "nebenwirkungen": "Hautreizungen, Rötung",
    "einnahmeart": "Auftragen",
    "dosisintervall": "alle 8–12 Stunden",
    "kategorie": "Schmerzgel (NSAR)",
    "max_einnahmedauer": "max. 7 Tage ohne ärztliche Rücksprache"
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
  const med = medikamente.find(m => m.name === medName);
  aktuellesMedikament = med;

  let dosis_mg = Math.round(weight * 10);
  intervallInStunden = 6;

  let dosierung = "";
  if (med.einheit === "Tablette") {
    const einheiten = dosis_mg / med.wirkstoff_pro_einheit;
    if (einheiten <= 0.25) dosierung = "¼ Tablette";
    else if (einheiten <= 0.5) dosierung = "½ Tablette";
    else if (einheiten <= 0.75) dosierung = "¾ Tablette";
    else dosierung = `${Math.round(einheiten)} Tablette(n)`;
  }

  document.getElementById("empf-dosierung").textContent = dosierung;
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
  document.getElementById("reminder-hinweis").textContent =
    "Hinweis: Die Dosierungsberechnung ist vereinfacht und ersetzt keine ärztliche Beratung.";
};

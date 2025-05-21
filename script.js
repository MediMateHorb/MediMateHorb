
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
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 6 Stunden",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "3 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Paracetamol 500",
    "wirkstoff": "Paracetamol",
    "standarddosierung": "500 mg alle 4–6 Stunden",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Nicht auf nüchternen Magen einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Alkohol, andere Schmerzmittel.",
    "nebenwirkungen": "Leberprobleme bei Überdosierung.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 6 Stunden",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "3 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Beispielmedikament 3",
    "wirkstoff": "Wirkstoff 3",
    "standarddosierung": "30 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 30,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 3",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 4",
    "wirkstoff": "Wirkstoff 4",
    "standarddosierung": "40 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 40,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 4",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 5",
    "wirkstoff": "Wirkstoff 5",
    "standarddosierung": "50 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 5",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 6",
    "wirkstoff": "Wirkstoff 6",
    "standarddosierung": "60 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 60,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 6",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 7",
    "wirkstoff": "Wirkstoff 7",
    "standarddosierung": "70 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 70,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 7",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 8",
    "wirkstoff": "Wirkstoff 8",
    "standarddosierung": "80 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 80,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 8",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 9",
    "wirkstoff": "Wirkstoff 9",
    "standarddosierung": "90 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 90,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 9",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 10",
    "wirkstoff": "Wirkstoff 10",
    "standarddosierung": "100 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 10",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 11",
    "wirkstoff": "Wirkstoff 11",
    "standarddosierung": "110 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 110,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 11",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 12",
    "wirkstoff": "Wirkstoff 12",
    "standarddosierung": "120 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 120,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 12",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 13",
    "wirkstoff": "Wirkstoff 13",
    "standarddosierung": "130 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 130,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 13",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 14",
    "wirkstoff": "Wirkstoff 14",
    "standarddosierung": "140 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 140,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 14",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 15",
    "wirkstoff": "Wirkstoff 15",
    "standarddosierung": "150 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 150,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 15",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 16",
    "wirkstoff": "Wirkstoff 16",
    "standarddosierung": "160 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 160,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 16",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 17",
    "wirkstoff": "Wirkstoff 17",
    "standarddosierung": "170 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 170,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 17",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 18",
    "wirkstoff": "Wirkstoff 18",
    "standarddosierung": "180 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 180,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 18",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 19",
    "wirkstoff": "Wirkstoff 19",
    "standarddosierung": "190 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 190,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 19",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 20",
    "wirkstoff": "Wirkstoff 20",
    "standarddosierung": "200 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 200,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 20",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 21",
    "wirkstoff": "Wirkstoff 21",
    "standarddosierung": "210 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 210,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 21",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 22",
    "wirkstoff": "Wirkstoff 22",
    "standarddosierung": "220 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 220,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 22",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 23",
    "wirkstoff": "Wirkstoff 23",
    "standarddosierung": "230 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 230,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 23",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 24",
    "wirkstoff": "Wirkstoff 24",
    "standarddosierung": "240 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 240,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 24",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 25",
    "wirkstoff": "Wirkstoff 25",
    "standarddosierung": "250 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 250,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 25",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 26",
    "wirkstoff": "Wirkstoff 26",
    "standarddosierung": "260 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 260,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 26",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 27",
    "wirkstoff": "Wirkstoff 27",
    "standarddosierung": "270 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 270,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 27",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 28",
    "wirkstoff": "Wirkstoff 28",
    "standarddosierung": "280 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 280,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 28",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 29",
    "wirkstoff": "Wirkstoff 29",
    "standarddosierung": "290 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 290,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 29",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 30",
    "wirkstoff": "Wirkstoff 30",
    "standarddosierung": "300 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 300,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 30",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 31",
    "wirkstoff": "Wirkstoff 31",
    "standarddosierung": "310 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 310,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 31",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 32",
    "wirkstoff": "Wirkstoff 32",
    "standarddosierung": "320 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 320,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 32",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 33",
    "wirkstoff": "Wirkstoff 33",
    "standarddosierung": "330 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 330,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 33",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 34",
    "wirkstoff": "Wirkstoff 34",
    "standarddosierung": "340 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 340,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 34",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 35",
    "wirkstoff": "Wirkstoff 35",
    "standarddosierung": "350 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 350,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 35",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 36",
    "wirkstoff": "Wirkstoff 36",
    "standarddosierung": "360 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 360,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 36",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 37",
    "wirkstoff": "Wirkstoff 37",
    "standarddosierung": "370 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 370,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 37",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 38",
    "wirkstoff": "Wirkstoff 38",
    "standarddosierung": "380 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 380,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 38",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 39",
    "wirkstoff": "Wirkstoff 39",
    "standarddosierung": "390 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 390,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 39",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 40",
    "wirkstoff": "Wirkstoff 40",
    "standarddosierung": "400 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 400,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 40",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 41",
    "wirkstoff": "Wirkstoff 41",
    "standarddosierung": "410 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 410,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 41",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 42",
    "wirkstoff": "Wirkstoff 42",
    "standarddosierung": "420 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 420,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 42",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 43",
    "wirkstoff": "Wirkstoff 43",
    "standarddosierung": "430 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 430,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 43",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 44",
    "wirkstoff": "Wirkstoff 44",
    "standarddosierung": "440 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 440,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 44",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 45",
    "wirkstoff": "Wirkstoff 45",
    "standarddosierung": "450 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 450,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 45",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 46",
    "wirkstoff": "Wirkstoff 46",
    "standarddosierung": "460 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 460,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 46",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 47",
    "wirkstoff": "Wirkstoff 47",
    "standarddosierung": "470 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 470,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 47",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 48",
    "wirkstoff": "Wirkstoff 48",
    "standarddosierung": "480 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 480,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 48",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 49",
    "wirkstoff": "Wirkstoff 49",
    "standarddosierung": "490 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 490,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 49",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 50",
    "wirkstoff": "Wirkstoff 50",
    "standarddosierung": "500 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 50",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 3",
    "wirkstoff": "Wirkstoff 3",
    "standarddosierung": "30 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 30,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 3",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 4",
    "wirkstoff": "Wirkstoff 4",
    "standarddosierung": "40 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 40,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 4",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 5",
    "wirkstoff": "Wirkstoff 5",
    "standarddosierung": "50 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 5",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 6",
    "wirkstoff": "Wirkstoff 6",
    "standarddosierung": "60 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 60,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 6",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 7",
    "wirkstoff": "Wirkstoff 7",
    "standarddosierung": "70 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 70,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 7",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 8",
    "wirkstoff": "Wirkstoff 8",
    "standarddosierung": "80 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 80,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 8",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 9",
    "wirkstoff": "Wirkstoff 9",
    "standarddosierung": "90 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 90,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 9",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 10",
    "wirkstoff": "Wirkstoff 10",
    "standarddosierung": "100 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 10",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 11",
    "wirkstoff": "Wirkstoff 11",
    "standarddosierung": "110 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 110,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 11",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 12",
    "wirkstoff": "Wirkstoff 12",
    "standarddosierung": "120 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 120,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 12",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 13",
    "wirkstoff": "Wirkstoff 13",
    "standarddosierung": "130 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 130,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 13",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 14",
    "wirkstoff": "Wirkstoff 14",
    "standarddosierung": "140 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 140,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 14",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 15",
    "wirkstoff": "Wirkstoff 15",
    "standarddosierung": "150 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 150,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 15",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 16",
    "wirkstoff": "Wirkstoff 16",
    "standarddosierung": "160 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 160,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 16",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 17",
    "wirkstoff": "Wirkstoff 17",
    "standarddosierung": "170 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 170,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 17",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 18",
    "wirkstoff": "Wirkstoff 18",
    "standarddosierung": "180 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 180,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 18",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 19",
    "wirkstoff": "Wirkstoff 19",
    "standarddosierung": "190 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 190,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 19",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 20",
    "wirkstoff": "Wirkstoff 20",
    "standarddosierung": "200 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 200,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 20",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 21",
    "wirkstoff": "Wirkstoff 21",
    "standarddosierung": "210 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 210,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 21",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 22",
    "wirkstoff": "Wirkstoff 22",
    "standarddosierung": "220 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 220,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 22",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 23",
    "wirkstoff": "Wirkstoff 23",
    "standarddosierung": "230 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 230,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 23",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 24",
    "wirkstoff": "Wirkstoff 24",
    "standarddosierung": "240 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 240,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 24",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 25",
    "wirkstoff": "Wirkstoff 25",
    "standarddosierung": "250 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 250,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 25",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 26",
    "wirkstoff": "Wirkstoff 26",
    "standarddosierung": "260 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 260,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 26",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 27",
    "wirkstoff": "Wirkstoff 27",
    "standarddosierung": "270 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 270,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 27",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 28",
    "wirkstoff": "Wirkstoff 28",
    "standarddosierung": "280 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 280,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 28",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 29",
    "wirkstoff": "Wirkstoff 29",
    "standarddosierung": "290 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 290,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 29",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 30",
    "wirkstoff": "Wirkstoff 30",
    "standarddosierung": "300 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 300,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 30",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 31",
    "wirkstoff": "Wirkstoff 31",
    "standarddosierung": "310 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 310,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 31",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 32",
    "wirkstoff": "Wirkstoff 32",
    "standarddosierung": "320 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 320,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 32",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 33",
    "wirkstoff": "Wirkstoff 33",
    "standarddosierung": "330 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 330,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 33",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 34",
    "wirkstoff": "Wirkstoff 34",
    "standarddosierung": "340 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 340,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 34",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 35",
    "wirkstoff": "Wirkstoff 35",
    "standarddosierung": "350 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 350,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 35",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 36",
    "wirkstoff": "Wirkstoff 36",
    "standarddosierung": "360 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 360,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 36",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 37",
    "wirkstoff": "Wirkstoff 37",
    "standarddosierung": "370 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 370,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 37",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 38",
    "wirkstoff": "Wirkstoff 38",
    "standarddosierung": "380 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 380,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 38",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 39",
    "wirkstoff": "Wirkstoff 39",
    "standarddosierung": "390 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 390,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 39",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 40",
    "wirkstoff": "Wirkstoff 40",
    "standarddosierung": "400 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 400,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 40",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 41",
    "wirkstoff": "Wirkstoff 41",
    "standarddosierung": "410 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 410,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 41",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 42",
    "wirkstoff": "Wirkstoff 42",
    "standarddosierung": "420 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 420,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 42",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 43",
    "wirkstoff": "Wirkstoff 43",
    "standarddosierung": "430 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 430,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 43",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 44",
    "wirkstoff": "Wirkstoff 44",
    "standarddosierung": "440 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 440,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 44",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 45",
    "wirkstoff": "Wirkstoff 45",
    "standarddosierung": "450 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 450,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 45",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 46",
    "wirkstoff": "Wirkstoff 46",
    "standarddosierung": "460 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 460,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 46",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 47",
    "wirkstoff": "Wirkstoff 47",
    "standarddosierung": "470 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 470,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 47",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 48",
    "wirkstoff": "Wirkstoff 48",
    "standarddosierung": "480 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 480,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 48",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 49",
    "wirkstoff": "Wirkstoff 49",
    "standarddosierung": "490 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 490,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 49",
    "max_einnahmedauer": "7 Tage"
  },
  {
    "name": "Beispielmedikament 50",
    "wirkstoff": "Wirkstoff 50",
    "standarddosierung": "500 mg täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1,
      0.5
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Keine besonderen Einschränkungen.",
    "wechselwirkungen": "Nicht bekannt.",
    "nebenwirkungen": "Leichte Müdigkeit möglich.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kategorie 50",
    "max_einnahmedauer": "7 Tage"
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

window.confirmIntake = async function () {
  const jetzt = new Date();
  const naechsteEinnahme = new Date(jetzt.getTime() + (intervallInStunden - 1) * 60 * 60 * 1000);
  const uhrzeit = naechsteEinnahme.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("reminder-status").textContent = `Du wirst um ${uhrzeit} an die nächste Einnahme erinnert.`;

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return alert('Nicht eingeloggt.');
  const email = user.email;

  sendReminderToSupabase(user.id, email, aktuellesMedikament.name, naechsteEinnahme.toISOString(), intervallInStunden);
};

async function sendReminderToSupabase(userId, email, medName, nextTime, intervalH) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/reminders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": "Bearer " + SUPABASE_KEY
      },
      body: JSON.stringify({
        user_id: userId,
        user_email: email,
        med_name: medName,
        next_time: nextTime,
        interval_h: intervalH,
        reminded: false
      })
    });

    if (!response.ok) throw new Error("Fehler beim Speichern des Reminders.");
    document.getElementById("reminder-feedback").textContent = "Erinnerung erfolgreich gespeichert.";
  } catch (error) {
    console.error(error);
    document.getElementById("reminder-feedback").textContent = "Fehler beim Speichern der Erinnerung.";
  }
}

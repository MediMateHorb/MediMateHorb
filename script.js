
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

const medikamente = [
  {
    "name": "Ibuprofen",
    "wirkstoff": "Ibuprofen",
    "standarddosierung": "400 mg alle 6–8 Stunden, max. 1200 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 400,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Nach dem Essen, mit Wasser einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Blutverdünner, SSRI",
    "nebenwirkungen": "Magenbeschwerden",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Schmerzen",
    "max_einnahmedauer": "4 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Paracetamol",
    "wirkstoff": "Paracetamol",
    "standarddosierung": "500 mg alle 4–6 Stunden, max. 4000 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Mit Wasser einnehmen, nüchtern oder nach dem Essen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Leberenzyme-induzierende Medikamente",
    "nebenwirkungen": "Lebertoxizität",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 4–6 Stunden",
    "kategorie": "Schmerzen/Fieber",
    "max_einnahmedauer": "3 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Aspirin",
    "wirkstoff": "Acetylsalicylsäure",
    "standarddosierung": "100 mg täglich oder bis 3000 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser, nach dem Essen einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Blutverdünner, NSAIDs",
    "nebenwirkungen": "Magenblutungen",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Schmerzen",
    "max_einnahmedauer": "3 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Omeprazol",
    "wirkstoff": "Omeprazol",
    "standarddosierung": "20 mg täglich, max. 40 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens nüchtern einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "Clopidogrel, Diazepam",
    "nebenwirkungen": "Kopfschmerzen",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Magen",
    "max_einnahmedauer": "8 Wochen"
  },
  {
    "name": "Metformin",
    "wirkstoff": "Metformin",
    "standarddosierung": "500–1000 mg 2× täglich, max. 2000 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 1000,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Zu den Mahlzeiten einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Kontrastmittel, Diuretika",
    "nebenwirkungen": "Magen-Darm-Beschwerden",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Diabetes",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Amoxicillin",
    "wirkstoff": "Amoxicillin",
    "standarddosierung": "500 mg 3× täglich, max. 3000 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser, gleichmäßig über den Tag verteilt.",
    "nahrung": "Milchprodukte vermeiden.",
    "wechselwirkungen": "Methotrexat, Allopurinol",
    "nebenwirkungen": "Durchfall",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Antibiotikum",
    "max_einnahmedauer": "5–10 Tage"
  },
  {
    "name": "Pantoprazol",
    "wirkstoff": "Pantoprazol",
    "standarddosierung": "40 mg täglich, max. 80 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 40,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Vor dem Essen mit Wasser einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "Atazanavir, Ketoconazol",
    "nebenwirkungen": "Schwindel",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Magen",
    "max_einnahmedauer": "8 Wochen"
  },
  {
    "name": "Simvastatin",
    "wirkstoff": "Simvastatin",
    "standarddosierung": "20 mg abends, max. 40 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Abends einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "CYP3A4-Hemmer",
    "nebenwirkungen": "Muskelschmerzen",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Cholesterin",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Levothyroxin",
    "wirkstoff": "Levothyroxin",
    "standarddosierung": "50 µg täglich, max. 200 µg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens nüchtern einnehmen.",
    "nahrung": "Soja vermeiden.",
    "wechselwirkungen": "Eisenpräparate, Kalzium",
    "nebenwirkungen": "Herzrasen",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Schilddrüse",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Diclofenac",
    "wirkstoff": "Diclofenac",
    "standarddosierung": "50 mg 2–3× täglich, max. 150 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nach dem Essen mit Wasser einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Blutverdünner, Diuretika",
    "nebenwirkungen": "Magenreizung",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Schmerzen",
    "max_einnahmedauer": "4 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Bisoprolol",
    "wirkstoff": "Bisoprolol",
    "standarddosierung": "5 mg morgens, max. 10 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens mit Wasser einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "Kalziumantagonisten, Insulin",
    "nebenwirkungen": "Müdigkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Blutdruck",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Atorvastatin",
    "wirkstoff": "Atorvastatin",
    "standarddosierung": "20 mg abends, max. 80 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Abends einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "CYP3A4-Hemmer",
    "nebenwirkungen": "Muskelschwäche",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Cholesterin",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Lisinopril",
    "wirkstoff": "Lisinopril",
    "standarddosierung": "10 mg morgens, max. 40 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 10,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens mit Wasser einnehmen.",
    "nahrung": "Kaliumreiche Nahrung vermeiden.",
    "wechselwirkungen": "Diuretika, NSAIDs",
    "nebenwirkungen": "Reizhusten",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Blutdruck",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Metoprolol",
    "wirkstoff": "Metoprolol",
    "standarddosierung": "50 mg morgens, max. 200 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Morgens einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "Kalziumantagonisten, Digoxin",
    "nebenwirkungen": "Schwindel",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Blutdruck",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Ramipril",
    "wirkstoff": "Ramipril",
    "standarddosierung": "5 mg morgens, max. 10 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Morgens einnehmen.",
    "nahrung": "Kaliumreiche Nahrung vermeiden.",
    "wechselwirkungen": "Diuretika, Lithium",
    "nebenwirkungen": "Kopfschmerzen",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Blutdruck",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Citalopram",
    "wirkstoff": "Citalopram",
    "standarddosierung": "20 mg täglich, max. 40 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens oder abends einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "MAO-Hemmer, Triptane",
    "nebenwirkungen": "Übelkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Depression",
    "max_einnahmedauer": "mehrere Monate"
  },
  {
    "name": "Sertralin",
    "wirkstoff": "Sertralin",
    "standarddosierung": "50 mg täglich, max. 200 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "MAO-Hemmer, Blutverdünner",
    "nebenwirkungen": "Schlaflosigkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Depression",
    "max_einnahmedauer": "mehrere Monate"
  },
  {
    "name": "Escitalopram",
    "wirkstoff": "Escitalopram",
    "standarddosierung": "10 mg täglich, max. 20 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 10,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "MAO-Hemmer, NSAIDs",
    "nebenwirkungen": "Müdigkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Depression",
    "max_einnahmedauer": "mehrere Monate"
  },
  {
    "name": "Venlafaxin",
    "wirkstoff": "Venlafaxin",
    "standarddosierung": "75 mg morgens, max. 225 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 75,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "MAO-Hemmer, Blutdruckmittel",
    "nebenwirkungen": "Schwitzen",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Depression",
    "max_einnahmedauer": "mehrere Monate"
  },
  {
    "name": "Tramadol",
    "wirkstoff": "Tramadol",
    "standarddosierung": "50–100 mg alle 6 Stunden, max. 400 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "SSRI, MAO-Hemmer",
    "nebenwirkungen": "Schwindel",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 6 Stunden",
    "kategorie": "Starke Schmerzen",
    "max_einnahmedauer": "kurzfristig"
  },
  {
    "name": "Morphin",
    "wirkstoff": "Morphin",
    "standarddosierung": "10–30 mg alle 4–6 Stunden, max. 120 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 10,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nach Bedarf mit Wasser einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Sedativa, Antidepressiva",
    "nebenwirkungen": "Verstopfung",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 4–6 Stunden",
    "kategorie": "Starke Schmerzen",
    "max_einnahmedauer": "nach Bedarf unter ärztlicher Aufsicht"
  },
  {
    "name": "Pregabalin",
    "wirkstoff": "Pregabalin",
    "standarddosierung": "75–150 mg 2× täglich, max. 600 mg",
    "einheit": "Kapsel",
    "wirkstoff_pro_einheit": 75,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Abends einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Opioide, Benzodiazepine",
    "nebenwirkungen": "Schwindel",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Nervenschmerzen",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Diazepam",
    "wirkstoff": "Diazepam",
    "standarddosierung": "5–10 mg nach Bedarf, max. 30 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Im Mund auflösen oder mit Wasser einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Opioide, Alkohol",
    "nebenwirkungen": "Benommenheit",
    "einnahmeart": "im Mund auflösen",
    "dosisintervall": "alle 6–12 Stunden",
    "kategorie": "Angst",
    "max_einnahmedauer": "kurzfristige Anwendung"
  },
  {
    "name": "Lorazepam",
    "wirkstoff": "Lorazepam",
    "standarddosierung": "1–2 mg nach Bedarf, max. 4 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 1,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Sublingual einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Sedativa, Alkohol",
    "nebenwirkungen": "Müdigkeit",
    "einnahmeart": "sublingual",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Angst",
    "max_einnahmedauer": "kurzfristige Anwendung"
  },
  {
    "name": "Warfarin",
    "wirkstoff": "Warfarin",
    "standarddosierung": "5 mg abends, individuell angepasst",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Abends einnehmen, regelmäßig INR kontrollieren.",
    "nahrung": "Vitamin-K-reiche Nahrung beachten.",
    "wechselwirkungen": "NSAIDs, Antibiotika",
    "nebenwirkungen": "Blutungsrisiko",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Blutverdünnung",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Insulin",
    "wirkstoff": "Insulin",
    "standarddosierung": "individuell nach Blutzuckerwerten",
    "einheit": "Injektion",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Zum Essen, täglich gleiche Uhrzeit.",
    "nahrung": "Keine Wechselwirkung.",
    "wechselwirkungen": "Betablocker, Alkohol",
    "nebenwirkungen": "Hypoglykämie",
    "einnahmeart": "subkutan",
    "dosisintervall": "12–24 Stunden",
    "kategorie": "Diabetes",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Prednisolon",
    "wirkstoff": "Prednisolon",
    "standarddosierung": "5–60 mg morgens mit Essen",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Morgens mit Frühstück einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Blutverdünner, Diuretika",
    "nebenwirkungen": "Gewichtszunahme",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Entzündung",
    "max_einnahmedauer": "nach ärztlicher Anweisung"
  },
  {
    "name": "Nitrolingual",
    "wirkstoff": "Glyceryltrinitrat",
    "standarddosierung": "0.4 mg bei Bedarf, max. 2 mg/Tag",
    "einheit": "Spray",
    "wirkstoff_pro_einheit": 0.4,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Bei Bedarf sublingual anwenden.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "PDE5-Hemmer, Blutdrucksenker",
    "nebenwirkungen": "Kopfschmerzen",
    "einnahmeart": "sublingual",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Herz",
    "max_einnahmedauer": "bei Bedarf"
  },
  {
    "name": "Ambroxol",
    "wirkstoff": "Ambroxol",
    "standarddosierung": "30 mg 2–3× täglich, max. 120 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 30,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nach dem Essen einnehmen.",
    "nahrung": "Keine Wechselwirkungen.",
    "wechselwirkungen": "Antitussiva",
    "nebenwirkungen": "Übelkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Husten",
    "max_einnahmedauer": "max. 7 Tage"
  },
  {
    "name": "Ibuprofen Saft",
    "wirkstoff": "Ibuprofen",
    "standarddosierung": "100 mg/2ml, max. 30 mg/kg",
    "einheit": "Saft",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 2,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Tee oder Saft einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Blutverdünner, SSRI",
    "nebenwirkungen": "Magenbeschwerden",
    "einnahmeart": "flüssig einnehmen",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Kinder",
    "max_einnahmedauer": "3 Tage ohne ärztlichen Rat"
  },
  {
    "name": "Paracetamol Zäpfchen",
    "wirkstoff": "Paracetamol",
    "standarddosierung": "125 mg rektal, max. 60 mg/kg",
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
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Kinder",
    "max_einnahmedauer": "3 Tage"
  },
  {
    "name": "Fenistil",
    "wirkstoff": "Dimetinden",
    "standarddosierung": "1 mg abends, max. 3 mg",
    "einheit": "Tropfen",
    "wirkstoff_pro_einheit": 1,
    "einheit_menge": 20,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Abends einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Sedativa, Alkohol",
    "nebenwirkungen": "Müdigkeit",
    "einnahmeart": "tropfen oder schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Allergie",
    "max_einnahmedauer": "nach ärztlicher Anweisung"
  },
  {
    "name": "ACC Hustensaft",
    "wirkstoff": "Acetylcystein",
    "standarddosierung": "200 mg 3× täglich, max. 600 mg",
    "einheit": "Saft",
    "wirkstoff_pro_einheit": 200,
    "einheit_menge": 5,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit viel Wasser einnehmen.",
    "nahrung": "Keine",
    "wechselwirkungen": "Nitroglycerin, Hustenstiller",
    "nebenwirkungen": "Übelkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Husten",
    "max_einnahmedauer": "5 Tage"
  },
  {
    "name": "Sab Simplex",
    "wirkstoff": "Simeticon",
    "standarddosierung": "40 mg vor jeder Mahlzeit, max. 120 mg",
    "einheit": "Tropfen",
    "wirkstoff_pro_einheit": 40,
    "einheit_menge": 15,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Vor dem Fläschchen geben.",
    "nahrung": "Keine",
    "wechselwirkungen": "Keine bekannt",
    "nebenwirkungen": "Keine bekannt",
    "einnahmeart": "tropfen",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Blähungen",
    "max_einnahmedauer": "nach Bedarf"
  },
  {
    "name": "Vomex",
    "wirkstoff": "Dimenhydrinat",
    "standarddosierung": "20–40 mg vor Reisen, max. 80 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Kurz vor Reise einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Sedativa, Alkohol",
    "nebenwirkungen": "Müdigkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Reiseübelkeit",
    "max_einnahmedauer": "nach Bedarf"
  },
  {
    "name": "Nasivin Kinder",
    "wirkstoff": "Oxymetazolin",
    "standarddosierung": "1–2 Tropfen 0,025% 2× täglich",
    "einheit": "Nasenspray",
    "wirkstoff_pro_einheit": 0.025,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nur kurzzeitig anwenden.",
    "nahrung": "Keine",
    "wechselwirkungen": "MAO-Hemmer, Blutdruckmittel",
    "nebenwirkungen": "Nasentrockenheit",
    "einnahmeart": "nasal",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Kinder",
    "max_einnahmedauer": "max. 5 Tage"
  },
  {
    "name": "Dentinox",
    "wirkstoff": "Lidocain",
    "standarddosierung": "nach Bedarf, geringe Menge",
    "einheit": "Gel",
    "wirkstoff_pro_einheit": 0,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Bei Zahnungsschmerzen lokal auftragen.",
    "nahrung": "Keine",
    "wechselwirkungen": "Keine",
    "nebenwirkungen": "Allergische Reaktionen",
    "einnahmeart": "lokal auf Zahnfleisch",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Kinder",
    "max_einnahmedauer": "nach Bedarf"
  },
  {
    "name": "Bepanthen",
    "wirkstoff": "Dexpanthenol",
    "standarddosierung": "nach Bedarf, äußerlich anwenden",
    "einheit": "Creme",
    "wirkstoff_pro_einheit": 0,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Auf die Haut auftragen.",
    "nahrung": "Keine",
    "wechselwirkungen": "Keine",
    "nebenwirkungen": "Hautreizung",
    "einnahmeart": "auftragen",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Haut",
    "max_einnahmedauer": "nach Bedarf"
  },
  {
    "name": "L-Thyroxin",
    "wirkstoff": "Levothyroxin",
    "standarddosierung": "50 µg täglich, max. 200 µg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Morgens nüchtern einnehmen.",
    "nahrung": "Soja vermeiden.",
    "wechselwirkungen": "Eisen, Kalzium",
    "nebenwirkungen": "Schlaflosigkeit",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Schilddrüse",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Thomapyrin",
    "wirkstoff": "Acetylsalicylsäure + Paracetamol + Coffein",
    "standarddosierung": "1 Tablette bei Bedarf, max. 3× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 250,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser nach dem Essen einnehmen.",
    "nahrung": "Alkohol vermeiden.",
    "wechselwirkungen": "Blutverdünner, Sedativa",
    "nebenwirkungen": "Magenreizungen",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Schmerzen",
    "max_einnahmedauer": "4 Tage"
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
  const age = parseInt(document.getElementById("age").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const med = medikamente.find(m => m.name === medName);
  aktuellesMedikament = med;

  let dosierung = med.standarddosierung;

  // Ibuprofen altersabhängig (z. B. 10 mg/kg bei Kindern, max 400 mg Erwachsene)
  if (med.name.toLowerCase().includes("ibuprofen") && weight) {
    let zielDosisMg = Math.min(10 * weight, 400);  // Kinder: 10 mg/kg, max 400 mg
    const einheiten = zielDosisMg / med.wirkstoff_pro_einheit;

    if (med.einheit === "Tablette") {
      if (einheiten <= 0.25) dosierung = "¼ Tablette";
      else if (einheiten <= 0.5) dosierung = "½ Tablette";
      else if (einheiten <= 0.75) dosierung = "¾ Tablette";
      else dosierung = `${Math.round(einheiten)} Tablette(n)`;
    } else if (med.einheit === "Saft") {
      const ml = (zielDosisMg / med.wirkstoff_pro_einheit) * med.einheit_menge;
      dosierung = `${ml.toFixed(1)} ml (entspricht ca. ${zielDosisMg} mg)`;
    }
  }

  // Paracetamol rektal (z. B. Zäpfchen) – 15 mg/kg
  if (med.name.toLowerCase().includes("zäpfchen") && weight) {
    const zielDosisMg = Math.round(weight * 15);
    const einheiten = zielDosisMg / med.wirkstoff_pro_einheit;
    dosierung = einheiten <= 0.5 ? "½ Zäpfchen" : einheiten <= 1 ? "1 Zäpfchen" : `${Math.round(einheiten)} Zäpfchen`;
  }

  // Standardanzeige
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
    "Hinweis: Die Dosierungsanzeige ist vereinfacht und ersetzt keine ärztliche Beratung.";
};


window.confirmIntake = async function () {
  const jetzt = new Date();
  const naechsteEinnahme = new Date(jetzt.getTime() + (intervallInStunden * 60 * 60 * 1000));
  const uhrzeit = naechsteEinnahme.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("reminder-status").textContent = `Du wirst um ${uhrzeit} an die nächste Einnahme erinnert.`;

  const { data: { user }, error } = await supabaseClient.auth.getUser();
  if (!user) return alert("Nicht eingeloggt.");
  const email = user.email;

  await fetch(`${SUPABASE_URL}/rest/v1/reminders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY
    },
    body: JSON.stringify({
      user_id: user.id,
      user_email: email,
      med_name: aktuellesMedikament.name,
      next_time: naechsteEinnahme.toISOString(),
      interval_h: intervallInStunden,
      reminded: false
    })
  });

  document.getElementById("reminder-feedback").textContent = "Erinnerung erfolgreich gespeichert.";
};

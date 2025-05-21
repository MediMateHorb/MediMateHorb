
const SUPABASE_URL = "https://qodjghrxucatvgvamdvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZGpnaHJ4dWNhdHZndmFtZHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzM0NTYsImV4cCI6MjA2MzQwOTQ1Nn0.DpMR66cpC57FCWA2Cs-drgOKuvjmBnTqarg2KPDWHcw";
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

let aktuellesMedikament = null;
let intervallInStunden = 6;

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
  const med = medikamente.find(m => m.name === medName);
  aktuellesMedikament = med;

  document.getElementById("empf-dosierung").textContent = med.standarddosierung;
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

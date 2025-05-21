
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
    "nahrung": "Milchprodukte 30 Minuten vermeiden.",
    "wechselwirkungen": "Eisenpräparate, Kalzium, Magnesium",
    "nebenwirkungen": "Herzklopfen, Nervosität bei Überdosierung",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Schilddrüsenhormon",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Sinupret forte",
    "wirkstoff": "Pflanzliche Kombination",
    "standarddosierung": "3× täglich 1 Tablette",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 0,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Unzerkaut mit etwas Wasser einnehmen.",
    "nahrung": "Unabhängig von Mahlzeiten.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Magen-Darm-Beschwerden möglich",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Erkältungsmittel",
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
    "wechselwirkungen": "Nicht bekannt bei äußerlicher Anwendung",
    "nebenwirkungen": "Hautrötungen, Juckreiz",
    "einnahmeart": "Auftragen",
    "dosisintervall": "alle 8–12 Stunden",
    "kategorie": "NSAR äußerlich",
    "max_einnahmedauer": "max. 7 Tage"
  },
  {
    "name": "Thomapyrin Classic",
    "wirkstoff": "ASS + Paracetamol + Coffein",
    "standarddosierung": "1–2 Tabletten bei Bedarf (max. 6/Tag)",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 250,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit ausreichend Wasser einnehmen.",
    "nahrung": "Nicht auf nüchternen Magen.",
    "wechselwirkungen": "Blutverdünner, Alkohol",
    "nebenwirkungen": "Magenprobleme, Nervosität",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 4–6 Stunden",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "3 Tage"
  },
  {
    "name": "Wick MediNait",
    "wirkstoff": "Paracetamol + Dextromethorphan + Doxylamin + Ephedrin",
    "standarddosierung": "1 Dosis (30 ml) abends vor dem Schlafen",
    "einheit": "Saft",
    "wirkstoff_pro_einheit": 30,
    "einheit_menge": 30,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nur abends, nicht mit Alkohol kombinieren.",
    "nahrung": "Unabhängig.",
    "wechselwirkungen": "Beruhigungsmittel, Alkohol",
    "nebenwirkungen": "Schläfrigkeit, Mundtrockenheit",
    "einnahmeart": "Trinken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Erkältungssirup",
    "max_einnahmedauer": "3 Tage"
  },
  {
    "name": "Fenistil Gel",
    "wirkstoff": "Dimetindenmaleat",
    "standarddosierung": "2–4× täglich dünn auftragen",
    "einheit": "Gel",
    "wirkstoff_pro_einheit": 1,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nicht auf offene Haut oder Schleimhäute.",
    "nahrung": "Nicht relevant.",
    "wechselwirkungen": "Nicht bekannt",
    "nebenwirkungen": "Hautreizung",
    "einnahmeart": "Auftragen",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Antiallergikum äußerlich",
    "max_einnahmedauer": "1 Woche"
  },
  {
    "name": "Bepanthen Augentropfen",
    "wirkstoff": "Dexpanthenol",
    "standarddosierung": "1 Tropfen je Auge 3–5× täglich",
    "einheit": "Tropfen",
    "wirkstoff_pro_einheit": 1,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Kontaktlinsen vorher entfernen.",
    "nahrung": "Nicht relevant.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Augenbrennen kurzfristig möglich",
    "einnahmeart": "Tropfen",
    "dosisintervall": "alle 4–6 Stunden",
    "kategorie": "Augenpflege",
    "max_einnahmedauer": "nach Bedarf"
  },
  {
    "name": "Paracetamol 500",
    "wirkstoff": "Paracetamol",
    "standarddosierung": "500–1000 mg alle 6–8 Stunden, max. 4 g/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Mit Wasser einnehmen, nicht auf nüchternen Magen.",
    "nahrung": "Nicht erforderlich.",
    "wechselwirkungen": "Alkohol, Lebermedikamente",
    "nebenwirkungen": "Leberfunktionsstörungen bei Überdosierung",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "3 Tage"
  },
  {
    "name": "Ibuprofen 400",
    "wirkstoff": "Ibuprofen",
    "standarddosierung": "1 Tablette (400 mg) alle 6–8 Stunden",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 400,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Mit einem Glas Wasser nach dem Essen einnehmen.",
    "nahrung": "Nach dem Essen empfohlen.",
    "wechselwirkungen": "Blutverdünner, Kortikosteroide",
    "nebenwirkungen": "Magen-Darm-Beschwerden, Kopfschmerzen",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "4 Tage"
  },
  {
    "name": "Metformin 1000",
    "wirkstoff": "Metformin",
    "standarddosierung": "1–2 Tabletten täglich zu den Mahlzeiten",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 1000,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Zu oder nach der Mahlzeit einnehmen.",
    "nahrung": "Zu den Mahlzeiten empfohlen.",
    "wechselwirkungen": "Jodhaltige Kontrastmittel, Alkohol",
    "nebenwirkungen": "Magen-Darm-Beschwerden, metallischer Geschmack",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Antidiabetikum",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Pantoprazol 40",
    "wirkstoff": "Pantoprazol",
    "standarddosierung": "1 Tablette morgens vor dem Frühstück",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 40,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nüchtern mit etwas Wasser einnehmen.",
    "nahrung": "30 Minuten vor dem Essen.",
    "wechselwirkungen": "Antimykotika, Clopidogrel",
    "nebenwirkungen": "Kopfschmerzen, Durchfall",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Protonenpumpenhemmer",
    "max_einnahmedauer": "8 Wochen"
  },
  {
    "name": "Ramipril 5",
    "wirkstoff": "Ramipril",
    "standarddosierung": "1× täglich 5 mg morgens",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen, unabhängig von der Mahlzeit.",
    "nahrung": "Keine Einschränkungen.",
    "wechselwirkungen": "Entwässerungstabletten, Kaliumpräparate",
    "nebenwirkungen": "Schwindel, trockener Husten",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Blutdrucksenker",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Amlodipin 5",
    "wirkstoff": "Amlodipin",
    "standarddosierung": "1× täglich 5 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit oder ohne Nahrung einnehmen.",
    "nahrung": "Grapefruitsaft vermeiden.",
    "wechselwirkungen": "Blutdruckmittel, Grapefruit",
    "nebenwirkungen": "Schwellungen, Kopfschmerzen",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Kalziumkanalblocker",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Simvastatin 20",
    "wirkstoff": "Simvastatin",
    "standarddosierung": "1× täglich abends 20 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Abends einnehmen.",
    "nahrung": "Grapefruit meiden.",
    "wechselwirkungen": "Blutverdünner, Antibiotika",
    "nebenwirkungen": "Muskelschmerzen, Kopfschmerzen",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Cholesterinsenker",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Bisoprolol 5",
    "wirkstoff": "Bisoprolol",
    "standarddosierung": "1× täglich 5 mg morgens",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens mit Wasser einnehmen.",
    "nahrung": "Unabhängig von Mahlzeiten.",
    "wechselwirkungen": "Insulin, Kalziumblocker",
    "nebenwirkungen": "Schwindel, Müdigkeit",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Betablocker",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Omeprazol 20",
    "wirkstoff": "Omeprazol",
    "standarddosierung": "1× täglich 20 mg vor dem Frühstück",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens vor dem Frühstück einnehmen.",
    "nahrung": "30 Minuten Abstand zu Mahlzeiten.",
    "wechselwirkungen": "Clopidogrel, Antimykotika",
    "nebenwirkungen": "Kopfschmerzen, Übelkeit",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Protonenpumpenhemmer",
    "max_einnahmedauer": "4–8 Wochen"
  },
  {
    "name": "Candesartan 8",
    "wirkstoff": "Candesartan",
    "standarddosierung": "1× täglich 8 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 8,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit einem Glas Wasser einnehmen.",
    "nahrung": "Unabhängig von der Mahlzeit.",
    "wechselwirkungen": "Kaliumpräparate, ACE-Hemmer",
    "nebenwirkungen": "Schwindel, Kopfschmerzen",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Blutdrucksenker (Sartan)",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Losartan 50",
    "wirkstoff": "Losartan",
    "standarddosierung": "1× täglich 50 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 50,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Unabhängig von der Mahlzeit.",
    "wechselwirkungen": "Kaliumsparende Diuretika, NSAIDs",
    "nebenwirkungen": "Schwindel, Muskelkrämpfe",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Blutdrucksenker (Sartan)",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Marcumar",
    "wirkstoff": "Phenprocoumon",
    "standarddosierung": "nach INR-Wert individuell",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 3,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.25,
      0.5,
      1
    ],
    "hinweise": "Immer zur gleichen Tageszeit.",
    "nahrung": "Vitamin-K-reiche Nahrung beeinflusst Wirkung.",
    "wechselwirkungen": "Viele, z. B. Antibiotika, NSAR",
    "nebenwirkungen": "Blutungen, Leberfunktionsstörung",
    "einnahmeart": "Schlucken",
    "dosisintervall": "täglich oder variabel",
    "kategorie": "Blutverdünner (Antikoagulans)",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "Rivaroxaban 20",
    "wirkstoff": "Rivaroxaban",
    "standarddosierung": "1× täglich 20 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit einer Mahlzeit einnehmen.",
    "nahrung": "Mit dem Essen.",
    "wechselwirkungen": "Andere Antikoagulanzien, Antimykotika",
    "nebenwirkungen": "Blutungen, Übelkeit",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "NOAK (Antikoagulans)",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "Apixaban 5",
    "wirkstoff": "Apixaban",
    "standarddosierung": "2× täglich 5 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Unabhängig von der Mahlzeit.",
    "wechselwirkungen": "Antikoagulanzien, Antimykotika",
    "nebenwirkungen": "Blutungsneigung, Übelkeit",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "NOAK (Antikoagulans)",
    "max_einnahmedauer": "nach ärztlicher Anweisung"
  },
  {
    "name": "Novaminsulfon 500",
    "wirkstoff": "Metamizol",
    "standarddosierung": "500–1000 mg bis 4× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Unabhängig von Mahlzeiten.",
    "wechselwirkungen": "Blutdrucksenker, Zytostatika",
    "nebenwirkungen": "Kreislaufprobleme, selten Agranulozytose",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 6–8 Stunden",
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "nach ärztlicher Anordnung"
  },
  {
    "name": "Amoxicillin 1000",
    "wirkstoff": "Amoxicillin",
    "standarddosierung": "3× täglich 1000 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 1000,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit viel Wasser, unabhängig von Mahlzeiten.",
    "nahrung": "Nicht notwendig.",
    "wechselwirkungen": "Allopurinol, Blutverdünner",
    "nebenwirkungen": "Durchfall, Hautausschläge",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 8 Stunden",
    "kategorie": "Antibiotikum",
    "max_einnahmedauer": "5–10 Tage"
  },
  {
    "name": "Doxycyclin 100",
    "wirkstoff": "Doxycyclin",
    "standarddosierung": "1× täglich 100 mg (ggf. 2× täglich)",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit viel Wasser, nicht im Liegen einnehmen.",
    "nahrung": "Milchprodukte meiden.",
    "wechselwirkungen": "Antazida, Eisenpräparate",
    "nebenwirkungen": "Lichtempfindlichkeit, Übelkeit",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Antibiotikum",
    "max_einnahmedauer": "7–14 Tage"
  },
  {
    "name": "Clarithromycin 500",
    "wirkstoff": "Clarithromycin",
    "standarddosierung": "2× täglich 500 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 500,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit oder ohne Nahrung, nicht mit Grapefruitsaft.",
    "nahrung": "Keine Milchprodukte direkt vor Einnahme.",
    "wechselwirkungen": "Statine, Blutverdünner, Antihistaminika",
    "nebenwirkungen": "Magen-Darm-Störungen, Geschmacksstörung",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Antibiotikum",
    "max_einnahmedauer": "7–14 Tage"
  },
  {
    "name": "Prednisolon 5",
    "wirkstoff": "Prednisolon",
    "standarddosierung": "abhängig von Erkrankung, z. B. 5–30 mg/Tag",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Morgens einnehmen, nicht abrupt absetzen.",
    "nahrung": "Mit dem Frühstück empfohlen.",
    "wechselwirkungen": "NSAR, Diuretika, Antidiabetika",
    "nebenwirkungen": "Gewichtszunahme, Bluthochdruck, Osteoporose",
    "einnahmeart": "Schlucken",
    "dosisintervall": "1× täglich",
    "kategorie": "Kortikosteroid",
    "max_einnahmedauer": "nach ärztlicher Anweisung"
  },
  {
    "name": "Salbutamol Spray",
    "wirkstoff": "Salbutamol",
    "standarddosierung": "1–2 Hübe bei Bedarf, max. 4× täglich",
    "einheit": "Spray",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Vor Gebrauch gut schütteln, langsam inhalieren.",
    "nahrung": "Nicht relevant.",
    "wechselwirkungen": "Betablocker, Theophyllin",
    "nebenwirkungen": "Herzrasen, Zittern",
    "einnahmeart": "Inhalieren",
    "dosisintervall": "bei Bedarf",
    "kategorie": "Bronchodilatator",
    "max_einnahmedauer": "nach Bedarf"
  },
  {
    "name": "Formoterol/Budesonid",
    "wirkstoff": "Formoterol + Budesonid",
    "standarddosierung": "2× täglich 1–2 Inhalationen",
    "einheit": "Inhalator",
    "wirkstoff_pro_einheit": 160,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nach Anwendung Mund ausspülen.",
    "nahrung": "Nicht relevant.",
    "wechselwirkungen": "Betablocker, Diuretika",
    "nebenwirkungen": "Heiserkeit, Pilzinfektion im Mund",
    "einnahmeart": "Inhalieren",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Asthma-Kombipräparat",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Insulin Lantus",
    "wirkstoff": "Insulin Glargin",
    "standarddosierung": "nach Blutzuckerwert, z. B. 10–40 Einheiten/Tag",
    "einheit": "Injektion",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Täglich zur gleichen Uhrzeit injizieren.",
    "nahrung": "Nicht relevant.",
    "wechselwirkungen": "Blutzuckersenkende Medikamente, Alkohol",
    "nebenwirkungen": "Unterzuckerung, Gewichtszunahme",
    "einnahmeart": "Spritzen",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Langzeitinsulin",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Eliquis 5",
    "wirkstoff": "Apixaban",
    "standarddosierung": "2× täglich 5 mg",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 5,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Unabhängig von der Mahlzeit.",
    "wechselwirkungen": "Blutverdünner, NSAR",
    "nebenwirkungen": "Blutungen, Übelkeit",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 12 Stunden",
    "kategorie": "Antikoagulans",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "Zopiclon 7,5",
    "wirkstoff": "Zopiclon",
    "standarddosierung": "1× abends vor dem Schlafen",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 7.5,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Direkt vor dem Schlafengehen einnehmen.",
    "nahrung": "Nicht mit fettreichen Speisen kombinieren.",
    "wechselwirkungen": "Alkohol, Beruhigungsmittel",
    "nebenwirkungen": "Müdigkeit, Bitterer Geschmack",
    "einnahmeart": "Schlucken",
    "dosisintervall": "1× täglich",
    "kategorie": "Schlafmittel",
    "max_einnahmedauer": "2–4 Wochen"
  },
  {
    "name": "Tamsulosin 0,4",
    "wirkstoff": "Tamsulosin",
    "standarddosierung": "1× täglich nach dem Frühstück",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 0.4,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Nach dem Frühstück mit einem Glas Wasser.",
    "nahrung": "Nach dem Essen.",
    "wechselwirkungen": "Blutdrucksenker",
    "nebenwirkungen": "Schwindel, Kopfschmerzen",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Urologikum",
    "max_einnahmedauer": "Dauertherapie"
  },
  {
    "name": "Tavor 1",
    "wirkstoff": "Lorazepam",
    "standarddosierung": "0,5–2 mg je nach Bedarf",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 1,
    "einheit_menge": 1,
    "teilbarkeit": [
      0.5,
      1
    ],
    "hinweise": "Nur kurzfristig einsetzen.",
    "nahrung": "Nicht mit Alkohol kombinieren.",
    "wechselwirkungen": "Beruhigungsmittel, Alkohol",
    "nebenwirkungen": "Abhängigkeit, Müdigkeit",
    "einnahmeart": "Schlucken",
    "dosisintervall": "bei Bedarf",
    "kategorie": "Benzodiazepin",
    "max_einnahmedauer": "max. 2 Wochen"
  },
  {
    "name": "Citalopram 20",
    "wirkstoff": "Citalopram",
    "standarddosierung": "1× täglich 20 mg morgens",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 20,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Morgens einnehmen.",
    "nahrung": "Unabhängig von der Mahlzeit.",
    "wechselwirkungen": "MAO-Hemmer, andere Antidepressiva",
    "nebenwirkungen": "Übelkeit, Müdigkeit",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Antidepressivum",
    "max_einnahmedauer": "mehrere Monate"
  },
  {
    "name": "DummyMed 36",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "DummyMed 37",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "DummyMed 38",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "DummyMed 39",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "DummyMed 40",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "DummyMed 41",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "DummyMed 42",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "DummyMed 43",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "DummyMed 44",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
  {
    "name": "DummyMed 45",
    "wirkstoff": "TestWirkstoff",
    "standarddosierung": "1× täglich",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [
      1
    ],
    "hinweise": "Mit Wasser einnehmen.",
    "nahrung": "Keine besonderen Hinweise.",
    "wechselwirkungen": "Keine bekannt.",
    "nebenwirkungen": "Keine bekannt.",
    "einnahmeart": "Schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Allgemein",
    "max_einnahmedauer": "nach ärztlicher Verordnung"
  },
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
    "kategorie": "Schmerzmittel",
    "max_einnahmedauer": "max. 4 Tage ohne ärztlichen Rat"
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
    "nebenwirkungen": "Lebertoxizität bei Überdosierung",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 4–6 Stunden",
    "kategorie": "Schmerzmittel/Fiebersenker",
    "max_einnahmedauer": "max. 3 Tage ohne ärztliche Rücksprache"
  },
  {
    "name": "Aspirin",
    "wirkstoff": "Acetylsalicylsäure",
    "standarddosierung": "100 mg täglich (bei Blutverdünnung) oder bis 3000 mg/Tag bei Schmerzen",
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
    "kategorie": "Schmerzmittel/Blutverdünner",
    "max_einnahmedauer": "Dauertherapie (niedrig dosiert), sonst max. 3 Tage"
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
    "hinweise": "Morgens nüchtern mit Wasser einnehmen.",
    "nahrung": "Grapefruit vermeiden.",
    "wechselwirkungen": "Clopidogrel, Diazepam",
    "nebenwirkungen": "Kopfschmerzen, Bauchschmerzen",
    "einnahmeart": "schlucken",
    "dosisintervall": "alle 24 Stunden",
    "kategorie": "Magenmittel",
    "max_einnahmedauer": "max. 8 Wochen ohne ärztliche Rücksprache"
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
    "kategorie": "Antidiabetikum",
    "max_einnahmedauer": "Dauertherapie"
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

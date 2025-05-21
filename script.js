
const SUPABASE_URL = "https://qodjghrxucatvgvamdvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZGpnaHJ4dWNhdHZndmFtZHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzM0NTYsImV4cCI6MjA2MzQwOTQ1Nn0.DpMR66cpC57FCWA2Cs-drgOKuvjmBnTqarg2KPDWHcw";

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("Login fehlgeschlagen: " + error.message);
    return;
  }

  document.getElementById("login-section").style.display = "none";
  document.getElementById("main-section").style.display = "block";
  filterMeds();
}

async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    alert("Registrierung fehlgeschlagen: " + error.message);
    return;
  }

  alert("Registrierung erfolgreich! Bitte E-Mail-Adresse bestätigen.");
}

let aktuellesMedikament = null;
let intervallInStunden = 0;

const medikamente = [...Array(50)].map((_, i) => ({
  name: i === 0 ? "Ibuprofen 400" : `Beispielmedikament ${i + 1}`,
  wirkstoff: i === 0 ? "Ibuprofen" : `Wirkstoff ${i + 1}`,
  standarddosierung: i === 0 ? "400 mg alle 6–8 Stunden" : `${(i + 1) * 10} mg täglich`,
  einheit: "Tablette",
  wirkstoff_pro_einheit: i === 0 ? 400 : (i + 1) * 10,
  einheit_menge: 1,
  teilbarkeit: [1, 0.5],
  hinweise: i === 0 ? "Mit Nahrung einnehmen." : "Standardhinweis.",
  nahrung: i === 0 ? "Vermeide Alkohol." : "Keine besonderen Einschränkungen.",
  wechselwirkungen: i === 0 ? "Blutverdünner, Kortison." : "Keine bekannt.",
  nebenwirkungen: i === 0 ? "Magenbeschwerden, Schwindel." : "Gelegentlich Kopfschmerzen.",
  einnahmeart: "Schlucken",
  dosisintervall: "alle 12 Stunden",
  kategorie: `Kategorie ${i + 1}`,
  max_einnahmedauer: "Wie vom Arzt verordnet"
}));

function filterMeds() {
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
}

function calculateDosage() {
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
}

async function confirmIntake() {
  const jetzt = new Date();
  const naechsteEinnahme = new Date(jetzt.getTime() + (intervallInStunden - 1) * 60 * 60 * 1000);
  const uhrzeit = naechsteEinnahme.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  document.getElementById("reminder-status").textContent = `Du wirst um ${uhrzeit} an die nächste Einnahme erinnert.`;

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) return alert('Nicht eingeloggt.');
  const email = user.email;

  sendReminderToSupabase(user.id, email, aktuellesMedikament.name, naechsteEinnahme.toISOString(), intervallInStunden);
}

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

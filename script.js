const SUPABASE_URL = "https://qodjghrxucatvgvamdvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZGpnaHJ4dWNhdHZndmFtZHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzM0NTYsImV4cCI6MjA2MzQwOTQ1Nn0.DpMR66cpC57FCWA2Cs-drgOKuvjmBnTqarg2KPDWHcw";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
  
  await checkReminder(data.user.id);
  setInterval(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (userData?.user) {
      await checkReminder(userData.user.id);
    }
  }, 5 * 60 * 1000); // alle 5 Minuten

  filterMeds();
  
    await loadActiveReminders();
    await loadTakenMedications();
  await loadTakenMedications();
  await loadActiveReminders();
    await loadTakenMedications();
  await loadTakenMedications();

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
  "name": "Cetirizin 10 mg",
  "wirkstoff": "Cetirizin",
  "standarddosierung": "10 mg 1× täglich (Erwachsene), 5 mg für Kinder ab 6",
  "einheit": "Tablette",
  "wirkstoff_pro_einheit": 10,
  "einheit_menge": 1,
  "teilbarkeit": [1, 0.5],
  "hinweise": "Abends einnehmen, da müde machend.",
  "nahrung": "Keine Einschränkungen",
  "wechselwirkungen": "Beruhigungsmittel",
  "nebenwirkungen": "Müdigkeit, Kopfschmerzen",
  "einnahmeart": "schlucken",
  "dosisintervall": "24",
  "kategorie": "Allergie",
  "max_einnahmedauer": "max. 2 Wochen ohne Rücksprache"
},
{
  "name": "Loratadin 10 mg",
  "wirkstoff": "Loratadin",
  "standarddosierung": "10 mg 1× täglich",
  "einheit": "Tablette",
  "wirkstoff_pro_einheit": 10,
  "einheit_menge": 1,
  "teilbarkeit": [1],
  "hinweise": "Morgens einnehmen.",
  "nahrung": "Keine",
  "wechselwirkungen": "Ketoconazol, Erythromycin",
  "nebenwirkungen": "Schläfrigkeit (selten)",
  "einnahmeart": "schlucken",
  "dosisintervall": "24",
  "kategorie": "Allergie",
  "max_einnahmedauer": "bis zu 14 Tage"
},
{
  "name": "Nurofen Junior Saft",
  "wirkstoff": "Ibuprofen",
  "standarddosierung": "5–10 mg/kg alle 6–8 h",
  "einheit": "Saft",
  "wirkstoff_pro_einheit": 100,
  "einheit_menge": 5,
  "teilbarkeit": [1],
  "hinweise": "Mit Essen oder Milch einnehmen.",
  "nahrung": "Keine Einschränkungen",
  "wechselwirkungen": "Blutverdünner, Kortison",
  "nebenwirkungen": "Magenbeschwerden",
  "einnahmeart": "schlucken",
  "dosisintervall": "8",
  "kategorie": "Fieber/Schmerz",
  "max_einnahmedauer": "3 Tage ohne Arzt"
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
    "name": "Aspirin 100",
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
    "name": "Testaminol",
    "wirkstoff": "Placebocin",
    "standarddosierung": "1 Tablette alle 0.01 h",
    "einheit": "Tablette",
    "wirkstoff_pro_einheit": 100,
    "einheit_menge": 1,
    "teilbarkeit": [1],
    "hinweise": "Nur zu Testzwecken.",
    "nahrung": "Keine",
    "wechselwirkungen": "Keine",
    "nebenwirkungen": "Keine",
    "einnahmeart": "schlucken",
    "dosisintervall": "0.01",
    "kategorie": "Test",
    "max_einnahmedauer": "unbegrenzt"
  }
]
;

window.filterMeds = function () {
  const search = document.getElementById("search-med").value.toLowerCase();
  const dropdown = document.getElementById("med-dropdown");
  dropdown.innerHTML = "";
  medikamente
    .filter(m => m.name.toLowerCase().includes(search))
    .sort((a, b) => a.name.localeCompare(b.name))
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

  let dosierung = med.standarddosierung || "";
  let zusatz = "";

  if (!med || !med.wirkstoff) return;

  const w = med.wirkstoff.toLowerCase();

  if (w.includes("ibuprofen") && weight) {
    if (weight >= 20 && weight <= 29) dosierung = "½ Tablette (200 mg)";
    else if (weight >= 30 && weight <= 39) dosierung = "½ Tablette (200 mg)";
    else if (weight >= 40) dosierung = "½–1 Tablette (200–400 mg)";
    else dosierung = "Nicht empfohlen für < 20 kg";
  } else if (w.includes("paracetamol") && weight) {
    if (weight >= 17 && weight <= 25) dosierung = "½ Tablette (250 mg)";
    else if (weight >= 26 && weight <= 32) dosierung = "½ Tablette (250 mg)";
    else if (weight >= 33 && weight <= 43) dosierung = "1 Tablette (500 mg)";
    else if (weight > 43) dosierung = "1–2 Tabletten (500–1000 mg)";
    else dosierung = "Nicht empfohlen für < 17 kg";
} else if (w.includes("cetirizin") && age) {
    if (age >= 6 && age < 12) dosierung = "½ Tablette (5 mg)";
    else if (age >= 12) dosierung = "1 Tablette (10 mg)";
    else dosierung = "Nicht empfohlen für < 6 Jahre";
  } else if (w.includes("loratadin") && age) {
    if (age >= 2 && age < 12 && weight <= 30) dosierung = "5 mg einmal täglich (½ Tablette)";
    else if ((age >= 2 && weight > 30) || age >= 12) dosierung = "10 mg einmal täglich (1 Tablette)";
    else dosierung = "Nicht empfohlen für < 2 Jahre";
  } else if (w.includes("acetylsalicylsäure") && age) {
    if (age >= 12 && age <= 15 && weight >= 40 && weight <= 50) dosierung = "1 Tablette (500 mg)";
    else if (age >= 16 && age < 65) dosierung = "1–2 Tabletten (500–1000 mg)";
    else if (age >= 65) dosierung = "1 Tablette (500 mg)";
    else dosierung = "Nicht empfohlen für < 12 Jahren";
  } else if (w.includes("acetylcystein") && age) {
    if (age >= 2 && age <= 5) dosierung = "5 ml 2–3× täglich (200–300 mg)";
    else if (age >= 6 && age <= 14) dosierung = "10 ml 2× täglich (400 mg)";
    else if (age >= 15) dosierung = "10 ml 3× täglich (600 mg)";
    else dosierung = "Nicht empfohlen für < 2 Jahre";
  } else if (w.includes("ambroxol") && age) {
    if (age < 2) dosierung = "15 mg/Tag in 2 Dosen";
    else if (age >= 2 && age <= 5) dosierung = "22,5 mg/Tag in 2 Dosen";
    else if (age >= 6 && age < 12) dosierung = "30–45 mg/Tag in 2–3 Dosen";
    else if (age >= 12) dosierung = "Erst 90 mg/Tag, dann 60 mg/Tag";
  } else if (w.includes("amoxicillin") && weight) {
    if (weight < 40) dosierung = "Dosis muss individuell angepasst werden (< 40 kg)";
    else dosierung = "250–500 mg alle 8 h, ggf. 750–1000 mg";
  }

  document.getElementById("empf-dosierung").textContent = dosierung + (zusatz || "");
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








async function checkReminder(userId) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userId)
    .eq("reminded", false)
    .lte("next_time", now);

  if (data && data.length > 0) {
    const reminder = data[0];

    // Push senden über Service Worker
    if (Notification.permission === "granted" && navigator.serviceWorker) {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.active.postMessage({
          type: "local-push",
          title: "💊 Medikamenten-Erinnerung",
          body: `Bitte nimm "${reminder.med_name}" jetzt ein.`
        });
      });
    }

    await supabase
      .from("reminders")
      .update({ reminded: true })
      .eq("id", reminder.id);
  }
}

// Service Worker registrieren
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(function(registration) {
      console.log('Service Worker registriert mit Scope:', registration.scope);
    }).catch(function(error) {
      console.error('Fehler bei Service Worker Registrierung:', error);
    });
}

// Berechtigung für Benachrichtigungen anfragen
if ('Notification' in window && Notification.permission !== 'granted') {
  Notification.requestPermission().then(permission => {
    if (permission === 'granted') {
      console.log("Benachrichtigungen erlaubt");
    }
  });
}

setInterval(async () => {
  const { data: userData } = await supabase.auth.getUser();
  if (userData?.user) {
    await checkReminder(userData.user.id);
  }
}, 5 * 60 * 1000); // alle 5 Minuten

async function loadIntakeHistory() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const { data, error } = await supabase
    .from("intake_log")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("time_taken", { ascending: false })
    .limit(50);

  document.getElementById("intake-history").style.display = "block";
  document.getElementById("intake-table").style.display = "table";
  const tbody = document.querySelector("#intake-table tbody");
  tbody.innerHTML = "";

  data.forEach(entry => {
    const row = document.createElement("tr");

    const medName = document.createElement("td");
    medName.textContent = entry.med_name;
    row.appendChild(medName);

    const timeTaken = document.createElement("td");
    timeTaken.textContent = new Date(entry.time_taken).toLocaleString();
    row.appendChild(timeTaken);

    const confirmed = document.createElement("td");
    confirmed.textContent = entry.confirmed ? "✅" : "❌";
    row.appendChild(confirmed);

    tbody.appendChild(row);
  });
}

async function loadActiveReminders() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const { data, error } = await supabase
    .from("reminders")
    .select("*")
    .eq("user_id", userData.user.id)
    .eq("reminded", false)
    .order("next_time", { ascending: true });

  const container = document.getElementById("active-reminders");
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = "<p>Keine offenen Einnahmen.</p>";
    return;
  }

  const rows = data.map(reminder => `
    <tr>
      <td>${reminder.med_name}</td>
      <td>${new Date(reminder.next_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
      <td><button onclick="confirmReminder('${reminder.id}')">✅ Bestätigen</button></td>
    </tr>
  `).join("");

  container.innerHTML = `
    <h3>Offene Einnahmen</h3>
    <table border="1" style="width:100%; margin-top:10px;">
      <thead>
        <tr>
          <th>Medikament</th>
          <th>Nächste Einnahme</th>
          <th>Aktion</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

async function confirmReminder(id) {
  const { error } = await supabase
    .from("reminders")
    .update({ reminded: true })
    .eq("id", id);

  if (!error) {
    await loadActiveReminders();
    await loadTakenMedications();
  await loadTakenMedications();
    
    await loadActiveReminders();
    await loadTakenMedications();
  await loadTakenMedications();
  await loadActiveReminders();
    await loadTakenMedications();
  await loadTakenMedications(); // aktualisiert Historie
  }
}



async function loadTakenMedications() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const { data, error } = await supabase
    .from("intake_log")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("time_taken", { ascending: false });

  const container = document.getElementById("medication-overview");
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = "<p>Bisher keine Medikamente eingenommen.</p>";
    return;
  }

  const rows = data.map(entry => `
    <tr>
      <td>${entry.med_name}</td>
      <td>${new Date(entry.time_taken).toLocaleString()}</td>
      <td>${entry.confirmed ? "✅ Eingenommen" : "❌ Nicht bestätigt"}</td>
    </tr>
  `).join("");

  container.innerHTML = `
    <h3>Bereits eingenommene Medikamente</h3>
    <table border="1" style="width:100%; margin-top:10px;">
      <thead>
        <tr>
          <th>Medikament</th>
          <th>Zeitpunkt</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}


// Neue Funktionen für Medikamenten-Übersicht (Tabs)

async function fetchMedications() {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('next_time', { ascending: false });

  if (error) {
    console.error('Fehler beim Laden der Reminder:', error);
    return;
  }

  const upcomingTable = document.querySelector('#upcoming-table tbody');
  const historyTable = document.querySelector('#history-table tbody');
  if (!upcomingTable || !historyTable) return;

  upcomingTable.innerHTML = '';
  historyTable.innerHTML = '';

  const now = new Date();

  data.forEach(entry => {
    const isConfirmed = entry.reminded;
    const nextTime = new Date(entry.next_time).toLocaleString();
    const medRow = `
      <tr>
        <td>${entry.med_name}</td>
        <td>${entry.interval_h}h</td>
        <td>${nextTime}</td>
        ${!isConfirmed
          ? `<td><button onclick="confirmMedication('${entry.id}')">Bestätigen</button></td>`
          : `<td>✔️</td>`}
      </tr>
    `;

    
    if (isConfirmed || new Date(entry.next_time) < now) {
      historyTable.innerHTML += `
        <tr>
          <td>${entry.med_name}</td>
          <td>${entry.interval_h}h</td>
          <td>${nextTime}</td>
        </tr>
      `;
    } else {
      upcomingTable.innerHTML += `
        <tr>
          <td>${entry.med_name}</td>
          <td>${entry.interval_h}h</td>
          <td>${nextTime}</td>
          <td><button onclick="toggleReminderStatus('${entry.id}')">Noch nicht eingenommen</button></td>
        </tr>
      `;
    }

  });
}

async function confirmMedication(id) {
  const { error } = await supabase
    .from('reminders')
    .update({ reminded: true })
    .eq('id', id);

  if (error) {
    alert('Fehler beim Bestätigen der Einnahme.');
    return;
  }

  fetchMedications();
}

function showTab(tab) {
  document.getElementById('tab-content-upcoming').style.display = tab === 'upcoming' ? 'block' : 'none';
  document.getElementById('tab-content-history').style.display = tab === 'history' ? 'block' : 'none';

  document.getElementById('tab-upcoming').style.fontWeight = tab === 'upcoming' ? 'bold' : 'normal';
  document.getElementById('tab-history').style.fontWeight = tab === 'history' ? 'bold' : 'normal';
}

document.addEventListener('DOMContentLoaded', fetchMedications);



// Erweiterte Einnahmefunktion mit/ohne Erinnerung
async function confirmIntakeWithReminder(remind = true) {
  const jetzt = new Date();
  const stdIntervall = parseFloat(aktuellesMedikament.dosisintervall) || 6;
  const naechsteEinnahme = new Date(jetzt.getTime() + stdIntervall * 60 * 60 * 1000);
  const uhrzeit = naechsteEinnahme.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const { data: userData } = await supabase.auth.getUser();

  if (!userData?.user) return alert("Nicht eingeloggt.");

  if (remind) {
    document.getElementById("reminder-status").textContent = `Du wirst um ${uhrzeit} an die nächste Einnahme erinnert.`;
    await supabase.from("reminders").insert({
      user_id: userData.user.id,
      user_email: userData.user.email,
      med_name: aktuellesMedikament.name,
      next_time: naechsteEinnahme.toISOString(),
      interval_h: stdIntervall,
      reminded: false
    });
  } else {
    document.getElementById("reminder-status").textContent = `Einnahme wurde ohne weitere Erinnerung gespeichert.`;
  }

  await supabase.from("intake_log").insert({
    user_id: userData.user.id,
    med_name: aktuellesMedikament.name,
    confirmed: true,
    time_taken: jetzt.toISOString()
  });

  fetchMedications();
}

// Klick auf Reminderstatus zum Aktualisieren
async function toggleReminderStatus(reminderId) {
  const { error } = await supabase
    .from('reminders')
    .update({ reminded: true })
    .eq('id', reminderId);

  if (error) {
    alert("Fehler beim Aktualisieren des Status.");
    return;
  }

  fetchMedications();
}

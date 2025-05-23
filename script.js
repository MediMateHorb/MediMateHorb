
const SUPABASE_URL = "https://qodjghrxucatvgvamdvu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZGpnaHJ4dWNhdHZndmFtZHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzM0NTYsImV4cCI6MjA2MzQwOTQ1Nn0.DpMR66cpC57FCWA2Cs-drgOKuvjmBnTqarg2KPDWHcw";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
  }
];

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

window.calculateDosage = function () {}

window.checkRemindersAfterLogin = async function () {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return;

  const nowIso = new Date().toISOString();
  const response = await fetch(`${SUPABASE_URL}/rest/v1/reminders?user_id=eq.${userData.user.id}&reminded=eq.false&next_time=lte.${nowIso}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY
    }
  });

  if (!response.ok) return;

  const reminders = await response.json();

  const container = document.createElement("div");
  container.style.background = "#fff3cd";
  container.style.border = "1px solid #ffeeba";
  container.style.padding = "1rem";
  container.style.marginBottom = "1rem";
  container.style.borderRadius = "6px";
  container.style.color = "#856404";

  if (reminders.length > 0) {
    let text = "⚠️ Du hast folgende offene Erinnerungen:<ul>";
    reminders.forEach(reminder => {
      text += `<li>${reminder.med_name} – <button onclick="markReminderDone('${reminder.id}')">✓ erledigt</button></li>`;
      if (Notification.permission === "granted") {
        new Notification("💊 Erinnerung", {
          body: `Bitte nimm dein Medikament: ${reminder.med_name}`,
        });
      }
    });
    text += "</ul>";
    container.innerHTML = text;
    const app = document.getElementById("app");
    app.prepend(container);
  }
};

window.markReminderDone = async function (reminderId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/reminders?id=eq.${reminderId}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ reminded: true })
  });
  if (res.ok) {
    location.reload();
  } else {
    alert("Konnte Erinnerung nicht aktualisieren.");
  }
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
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  checkRemindersAfterLogin();
};

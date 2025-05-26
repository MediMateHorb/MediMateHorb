
const supabase = supabase.createClient('https://qodjghrxucatvgvamdvu.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZGpnaHJ4dWNhdHZndmFtZHZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4MzM0NTYsImV4cCI6MjA2MzQwOTQ1Nn0.DpMR66cpC57FCWA2Cs-drgOKuvjmBnTqarg2KPDWHcw');

async function fetchMedications() {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('next_time', { ascending: false });

  if (error) {
    console.error('Fehler beim Laden der Reminder:', error);
    return;
  }

  const upcomingTable = document.querySelector('#upcoming-table tbody');
  const historyTable = document.querySelector('#history-table tbody');
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
      upcomingTable.innerHTML += medRow;
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

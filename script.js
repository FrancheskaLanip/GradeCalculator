// Our data array — the single source of truth for all subjects/grades.
let subjects = [];
let nextId = 1;

const form = document.getElementById('gradeForm');
const ledger = document.getElementById('ledger');
const avgValue = document.getElementById('avgValue');
const formError = document.getElementById('formError');

function tierClass(grade){
  if (grade < 75) return 'low';
  if (grade < 85) return 'mid';
  return 'high';
}

// DOM change #1: rebuild the ledger rows whenever the array changes.
function renderLedger(){
  ledger.innerHTML = '';

  if (subjects.length === 0){
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No subjects added yet. Use the form above to add your first grade.';
    ledger.appendChild(empty);
    return;
  }

  subjects.forEach(function(s){
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML =
      '<span class="subj">' + s.subject + '</span>' +
      '<span class="val grade ' + tierClass(s.grade) + '">' + s.grade + '</span>' +
      '<span class="val">' + s.units + ' u</span>' +
      '<button class="del" type="button" data-id="' + s.id + '" aria-label="Remove ' + s.subject + '">×</button>';
    ledger.appendChild(row);
  });
}

// DOM change #2: recompute and display the weighted average.
function renderAverage(){
  if (subjects.length === 0){
    avgValue.textContent = '—';
    avgValue.className = 'value';
    return;
  }
  // map() turns each subject into its weighted contribution
  const weighted = subjects.map(function(s){ return s.grade * s.units; });
  const totalWeighted = weighted.reduce(function(a, b){ return a + b; }, 0);
  const totalUnits = subjects.reduce(function(a, s){ return a + s.units; }, 0);
  const avg = totalWeighted / totalUnits;

  avgValue.textContent = avg.toFixed(2);
  avgValue.className = 'value ' + tierClass(avg);
}

function refresh(){
  renderLedger();
  renderAverage();
}

// Event listener #1: form submit (adds a new subject, prevents page reload)
form.addEventListener('submit', function(event){
  event.preventDefault();
  formError.textContent = '';

  const subjectInput = document.getElementById('subject');
  const gradeInput = document.getElementById('grade');
  const unitsInput = document.getElementById('units');

  const subjectName = subjectInput.value.trim();
  const grade = parseFloat(gradeInput.value);
  const units = parseFloat(unitsInput.value);

  if (!subjectName || isNaN(grade) || isNaN(units) || grade < 0 || grade > 100 || units <= 0){
    formError.textContent = 'Please enter a valid subject, a grade from 0-100, and a positive unit value.';
    return;
  }

  subjects.push({ id: nextId++, subject: subjectName, grade: grade, units: units });

  form.reset();
  subjectInput.focus();
  refresh();
});

// Event listener #2: click (removes a subject via the × button, uses event delegation)
ledger.addEventListener('click', function(event){
  const btn = event.target.closest('.del');
  if (!btn) return;
  const id = Number(btn.getAttribute('data-id'));
  subjects = subjects.filter(function(s){ return s.id !== id; });
  refresh();
});

refresh();
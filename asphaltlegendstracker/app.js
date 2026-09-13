let cars = [];
let flatRows = []; // each item: { car, stat }

// Create a simple ID from car name
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Load cars.json
async function loadCars() {
  const res = await fetch('cars.json');
  if (!res.ok) {
    console.error('Failed to load cars.json');
    cars = [];
    flatRows = [];
    return;
  }
  cars = await res.json();

  // One row per (car, stat)
  flatRows = cars.flatMap(car =>
    car.stats.map(stat => ({ car, stat }))
  );
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Render the main table
function renderCarsTable(rows) {
  const tbody = document.getElementById('cars-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (rows.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="8">No data available.</td>';
    tbody.appendChild(tr);
    return;
  }

  rows.forEach(entry => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.stat.level}</td>
      <td>${entry.stat.rank}</td>
      <td>${entry.car.class}</td>
      <td>${entry.stat.top_speed_kmh}</td>
      <td>${entry.stat.acceleration}</td>
      <td>${entry.stat.handling}</td>
      <td>${entry.stat.nitro}</td>
      <td>
        <a href="car.html?id=${entry.car.id}">
          ${escapeHtml(entry.car.name)} (${escapeHtml(entry.car.brand)})
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Sorting
let currentSort = { key: 'rank', dir: 'asc' }; // default: sort by rank ascending

function sortRows(key, dir) {
  const rows = [...flatRows];

  rows.sort((a, b) => {
    const carA = a.car;
    const carB = b.car;
    const statA = a.stat;
    const statB = b.stat;

    let valA, valB;

    switch (key) {
      case 'level':
        valA = statA.level;
        valB = statB.level;
        break;
      case 'rank':
        valA = statA.rank;
        valB = statB.rank;
        break;
      case 'class':
        // Order: D < C < B < A < S
        const classOrder = { D: 0, C: 1, B: 2, A: 3, S: 4 };
        valA = classOrder[carA.class] ?? 99;
        valB = classOrder[carB.class] ?? 99;
        break;
      case 'top_speed_kmh':
        valA = statA.top_speed_kmh;
        valB = statB.top_speed_kmh;
        break;
      case 'acceleration':
        valA = statA.acceleration;
        valB = statB.acceleration;
        break;
      case 'handling':
        valA = statA.handling;
        valB = statB.handling;
        break;
      case 'nitro':
        valA = statA.nitro;
        valB = statB.nitro;
        break;
      default:
        valA = 0;
        valB = 0;
    }

    if (valA < valB) return dir === 'asc' ? -1 : 1;
    if (valA > valB) return dir === 'asc' ? 1 : -1;
    return 0;
  });

  return rows;
}

function updateSortIndicators() {
  const headers = document.querySelectorAll('#cars-table thead th[data-sort]');
  headers.forEach(th => {
    const key = th.getAttribute('data-sort');
    th.classList.remove('sort-asc', 'sort-desc');
    if (key === currentSort.key) {
      th.classList.add(currentSort.dir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

function initSorting() {
  const headers = document.querySelectorAll('#cars-table thead th[data-sort]');
  headers.forEach(th => {
    th.addEventListener('click', () => {
      const key = th.getAttribute('data-sort');

      if (currentSort.key === key) {
        // Toggle direction
        currentSort.dir = currentSort.dir === 'asc' ? 'desc' : 'asc';
      } else {
        // New column: sort ascending
        currentSort.key = key;
        currentSort.dir = 'asc';
      }

      const sorted = sortRows(currentSort.key, currentSort.dir);
      renderCarsTable(sorted);
      updateSortIndicators();
    });
  });
}

// Initialize main page
function initIndexPage() {
  initSorting();
  const sorted = sortRows(currentSort.key, currentSort.dir);
  renderCarsTable(sorted);
  updateSortIndicators();
}

// Initialize Add page
function initAddPage() {
  const isNewCarCheckbox = document.getElementById('is-new-car');
  const newCarFields = document.getElementById('new-car-fields');
  const existingCarFields = document.getElementById('existing-car-fields');
  const existingCarSelect = document.getElementById('existing-car-select');
  const generateBtn = document.getElementById('generate-json');
  const jsonOutput = document.getElementById('json-output');

  if (!isNewCarCheckbox) return; // not on add page

  // Fill existing car dropdown
  existingCarSelect.innerHTML = '';
  cars.forEach(car => {
    const opt = document.createElement('option');
    opt.value = car.id;
    opt.textContent = `${car.name} (${car.brand})`;
    existingCarSelect.appendChild(opt);
  });

  function toggleCarFields() {
    const isNew = isNewCarCheckbox.checked;
    newCarFields.style.display = isNew ? 'block' : 'none';
    existingCarFields.style.display = isNew ? 'none' : 'block';
  }

  isNewCarCheckbox.addEventListener('change', toggleCarFields);
  toggleCarFields();

  generateBtn.addEventListener('click', () => {
    const isNew = isNewCarCheckbox.checked;

    const rank = Number(document.getElementById('stat-rank').value || 0);
    const level = Number(document.getElementById('stat-level').value || 0);
    const top_speed_kmh = Number(document.getElementById('stat-top-speed').value || 0);
    const acceleration = Number(document.getElementById('stat-acceleration').value || 0);
    const handling = Number(document.getElementById('stat-handling').value || 0);
    const nitro = Number(document.getElementById('stat-nitro').value || 0);

    const statObj = {
      rank,
      level,
      top_speed_kmh,
      acceleration,
      handling,
      nitro
    };

    let output;

    if (isNew) {
      const name = document.getElementById('car-name').value.trim();
      const brand = document.getElementById('car-brand').value.trim();
      const cls = document.getElementById('car-class').value;

      if (!name || !brand) {
        jsonOutput.textContent = 'Please fill car name and brand.';
        return;
      }

      const id = slugify(name);

      const newCar = {
        id,
        name,
        brand,
        class: cls,
        stats: [statObj]
      };

      output = newCar;
    } else {
      const selectedId = existingCarSelect.value;
      const car = cars.find(c => c.id === selectedId);
      if (!car) {
        jsonOutput.textContent = 'No car selected.';
        return;
      }

      output = {
        note: `Add this object to the "stats" array of car "${car.name}"`,
        newStat: statObj
      };
    }

    jsonOutput.textContent = JSON.stringify(output, null, 2);
  });
}

// Car detail page
function initCarDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('car-detail');
  if (!container || !id) return;

  const car = cars.find(c => c.id === id);
  if (!car) {
    container.innerHTML = '<p>Car not found.</p>';
    return;
  }

  let html = `
    <h2>${escapeHtml(car.name)} <small>(${escapeHtml(car.brand)})</small></h2>
    <p>Class: ${car.class}</p>
    <h3>All Stats</h3>
    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Level</th>
          <th>Top Speed (km/h)</th>
          <th>Acceleration</th>
          <th>Handling</th>
          <th>Nitro</th>
        </tr>
      </thead>
      <tbody>
  `;

  car.stats.forEach(s => {
    html += `
      <tr>
        <td>${s.rank}</td>
        <td>${s.level}</td>
        <td>${s.top_speed_kmh}</td>
        <td>${s.acceleration}</td>
        <td>${s.handling}</td>
        <td>${s.nitro}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <p><a href="index.html">← Back to list</a></p>
  `;

  container.innerHTML = html;
}

// Start everything
window.addEventListener('DOMContentLoaded', async () => {
  await loadCars();

  if (document.getElementById('cars-table')) {
    initIndexPage();
  }

  if (document.getElementById('car-detail')) {
    initCarDetailPage();
  }
});
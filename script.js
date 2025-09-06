function populateWeaponDropdowns() {
  // Populate P1 Weapons 1-8
  for (let i = 1; i <= 8; i++) {
    const select = document.getElementById(`weapon${i}Select`);
    if (!select) continue;

    weapons.forEach(weapon => {
      const option = document.createElement("option");
      option.value = weapon.name;
      option.textContent = weapon.name;
      select.appendChild(option);
    });

select.addEventListener("change", () => {
  updateDefenseTable();
  updateRadarChart();
});
  }

  // Populate P2 Weapons 1-8
  for (let i = 1; i <= 8; i++) {
    const select = document.getElementById(`opponentWeapon${i}`);
    if (!select) continue;

    weapons.forEach(weapon => {
      const option = document.createElement("option");
      option.value = weapon.name;
      option.textContent = weapon.name;
      select.appendChild(option);
    });

select.addEventListener("change", () => {
  updateDefenseTable();
  updateRadarChart();
});
  }
}

function renderWeaponTable(weaponList) {
  const tbody = document.getElementById("weaponTableBody");
  tbody.innerHTML = "";

  weaponList.forEach(weapon => {
    const tr = document.createElement("tr");

    // Weapon Name
    const nameTd = document.createElement("td");
    nameTd.textContent = weapon.name;
    nameTd.style.fontWeight = "bold";
    tr.appendChild(nameTd);

    // Offensive Icons
    ["air", "dark", "earth", "fire", "light", "water", "physical"].forEach(type => {
      const td = document.createElement("td");
      td.textContent = weapon[type] || 0;
      tr.appendChild(td);
    });

    // Defensive Icons
    ["air", "dark", "earth", "fire", "light", "water", "physical"].forEach(type => {
      const td = document.createElement("td");
      td.textContent = weapon.defense?.[type] || 0;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function populateMasterWeaponPanel() {
  const sortedWeapons = weapons
    .filter(w => w.name && w.name.toLowerCase() !== "none") 
    .sort((a, b) => a.name.localeCompare(b.name));

  renderWeaponTable(sortedWeapons);
}

function toggleWeaponPanel() {
  const panel = document.getElementById("weaponPanel");
  const panelWidth = panel.offsetWidth;

  if (panel.style.left === "0px") {
    panel.style.left = `-${panelWidth}px`; 
  } else {
    panel.style.left = "0px"; 
  }
}

const abilities = {
  "Halitosis": { type: "flat", icons: { earth: 2 } },
  "Static Cling": { type: "flat", icons: { light: 3 } },
  "Drizzle": { type: "flat", icons: { water: 4 } },
  "Cranky": { type: "boost", percent: 5 },
  "An Icicle": { type: "flat", icons: { water: 6 } },
  "Sear": { type: "flat", icons: { fire: 4 } },
  "Irritable Minions": { type: "flat", icons: { dark: 8 } },
  "Tempest": { type: "flat", icons: { air: 6 } },
  "Rally Cry": { type: "flat", icons: { fire: 6 } },
  "Adrenaline Rush": { type: "boost", percent: 8.125 },
  "Meepit Stampede": { type: "flat", icons: { dark: 10 } },
  "Summon Monoceraptor": { type: "flat", icons: { fire: 10 } },
  "Esophagor Stench": { type: "flat", icons: { earth: 10 } }
};

const iconColors = {
  air: "#99b2e3",
  earth: "#28cc2c",
  dark: "#8c29a3",
  light: "#fff299",
  fire: "#ff870a",
  water: "#43d5bf",
  physical: "#646464"
};

function getDefaultDefense() {
  return {
    air: 0,
    dark: 0,
    earth: 0,
    fire: 0,
    light: 0,
    water: 0,
    physical: 0
  };
}  

function updateDefenseTable() {
  const p1Weapons = [];
  const p2Weapons = [];

  for (let i = 1; i <= 4; i++) {
    const select = document.getElementById(`weapon${i}Select`);
    if (select) p1Weapons.push(select.value);
  }

for (let i = 1; i <= 8; i++) {
  const select = document.getElementById(`opponentWeapon${i}`);
  if (select) p2Weapons.push(select.value);
}

console.log("P1 Selected Weapons:", p1Weapons);
console.log("P2 Selected Weapons:", p2Weapons);

p1Weapons.forEach(name => {
  const weapon = weapons.find(w => w.name === name);
  const def = weapon && weapon.defense ? weapon.defense : getDefaultDefense();
  console.log("P1 Defense for", name, def);
});

p2Weapons.forEach(name => {
  const weapon = weapons.find(w => w.name === name);
  const def = weapon && weapon.defense ? weapon.defense : getDefaultDefense();
  console.log("P2 Defense for", name, def);
}); 

  const allTypes = ["air", "dark", "earth", "fire", "light", "water", "physical"];

  const p1Defense = {};
  const p2Defense = {};

allTypes.forEach(type => {
  p1Defense[type] = Math.max(
    ...p1Weapons.map(name =>
      (weapons.find(w => w.name === name)?.defense || getDefaultDefense())[type]
    )
  );
  p2Defense[type] = Math.max(
    ...p2Weapons.map(name =>
      (weapons.find(w => w.name === name)?.defense || getDefaultDefense())[type]
    )
  );
});

console.table({ p1Defense, p2Defense });

  const playerRow = document.getElementById("p1DefenseRow");
  const opponentRow = document.getElementById("p2DefenseRow");

  // Clear Cells
  playerRow.innerHTML = "<td><strong>P1</strong></td>";
  opponentRow.innerHTML = "<td><strong>P2</strong></td>";

  allTypes.forEach(type => {
    const p1Val = p1Defense[type];
    const p2Val = p2Defense[type];

    // Vulnerability
    const p1Vulnerable = p2Val > p1Val;
    const p2Vulnerable = p1Val > p2Val;

    playerRow.innerHTML += `<td style="color: ${p1Vulnerable ? 'red' : 'black'}">${p1Val || 0}</td>`;
    opponentRow.innerHTML += `<td style="color: ${p2Vulnerable ? 'red' : 'black'}">${p2Val || 0}</td>`;
  });
}

function updateRadarChart() {
  const opponentIcons = {
    air: 0, dark: 0, earth: 0, fire: 0, light: 0, water: 0, physical: 0
  };
  for (let i = 1; i <= 8; i++) {
    const select = document.getElementById(`opponentWeapon${i}`);
    const weaponName = select.value;
    const weapon = weapons.find(w => w.name === weaponName);
    if (weapon) {
      for (const type of Object.keys(opponentIcons)) {
        opponentIcons[type] = Math.max(opponentIcons[type], weapon[type] || 0);
      }
    }
  }

  const playerIcons = {
    air: 0, dark: 0, earth: 0, fire: 0, light: 0, water: 0, physical: 0
  };
  for (let i = 1; i <= 8; i++) {
    const select = document.getElementById(`weapon${i}Select`);
    const weaponName = select?.value;
    const weapon = weapons.find(w => w.name === weaponName);
    if (weapon) {
      for (const type of Object.keys(playerIcons)) {
        playerIcons[type] = Math.max(playerIcons[type], weapon[type] || 0);
      }
    }
  }

  const chartColors = Object.keys(playerIcons).map(type => iconColors[type] || "#000");
  const chartLabels = Object.keys(playerIcons).map(type => type.charAt(0).toUpperCase() + type.slice(1));
  const playerData = Object.values(playerIcons);
  const opponentData = Object.values(opponentIcons);

  const ctx = document.getElementById("iconChart").getContext("2d");
  if (window.iconChartInstance) {
    window.iconChartInstance.destroy();
  }

  window.iconChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: 'P1',
          data: playerData,
          backgroundColor: 'rgba(100, 149, 237, 0.2)',
          borderColor: 'rgba(100, 149, 237, 1)',
          pointBackgroundColor: chartColors
        },
        {
          label: 'P2',
          data: opponentData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          pointBackgroundColor: 'rgba(255, 99, 132, 1)'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
          ticks: {
            stepSize: 1,
            backdropColor: 'transparent'
          },
          backgroundColor: 'rgba(255, 255, 255, 095'
        }
      }
    }
  });
}

// Constants Calc
function simulate() {
  const w1Name = document.getElementById("weapon1Select").value;
  const w2Name = document.getElementById("weapon2Select").value;
  const multiplier = parseFloat(document.getElementById("strength").value);
  const abilityName = document.getElementById("ability").value;

  const p1 = weapons.find(w => w.name === w1Name);
  const p2 = weapons.find(w => w.name === w2Name);
  const ability = abilities[abilityName];

  if (!p1 || !p2 || isNaN(multiplier)) {
    document.getElementById("result").innerText = "Error: Weapon or strength not selected.";
    return;
  }

  const combinedIcons = {};

  for (const type of ["air", "dark", "earth", "fire", "light", "water", "physical"]) {
    combinedIcons[type] = (p1[type] || 0) + (p2[type] || 0);
  }

  if (ability && ability.type === "flat") {
    for (const [type, value] of Object.entries(ability.icons)) {
      combinedIcons[type] = (combinedIcons[type] || 0) + value;
    }
  }

  let rows = "";
  let totalMin = 0;
  let totalMax = 0;

  for (const [type, value] of Object.entries(combinedIcons)) {
    const min = Math.round(value * 0.8 * 10) / 10;
    const max = Math.round(value * 1.2 * 10) / 10;
    totalMin += min;
    totalMax += max;
    const color = iconColors[type.toLowerCase()] || "#000";
    const iconImage = `<img src="icons/${type.toLowerCase()}.png" alt="${type}" style="height: 20px; vertical-align: middle; margin-left: 5px;">`;
  rows += `<tr>
  <td style="color: ${color}; font-weight: bold;">
    ${type.charAt(0).toUpperCase() + type.slice(1)}
    <img src="icons/${type.toLowerCase()}.png" alt="${type}" style="height: 20px; vertical-align: middle; margin-left: 5px;">
  </td>
  <td>${min}</td>
  <td>${max}</td>
</tr>`;
  }

  let scaledMin = Math.round(totalMin * multiplier * 10) / 10;
  let scaledMax = Math.round(totalMax * multiplier * 10) / 10;

  let boostText = "";
  if (ability && ability.type === "boost") {
    const boostPercent = ability.percent;
    const boostMin = Math.round(scaledMin * boostPercent / 100 * 10) / 10;
    const boostMax = Math.round(scaledMax * boostPercent / 100 * 10) / 10;
    scaledMin += boostMin;
    scaledMax += boostMax;
    boostText = `<tr><td><strong>${abilityName} Bonus</strong></td><td>+${boostMin}</td><td>+${boostMax}</td></tr>`;
  }

  const totalBaseMin = Math.round(totalMin * multiplier * 10) / 10;
  const totalBaseMax = Math.round(totalMax * multiplier * 10) / 10;

  let tableRows = `
    <tr><td><strong>Total Icons</strong></td>
    <td><strong>${totalMin}</strong></td>
    <td><strong>${totalMax}</strong></td></tr>
    <tr><td><strong>Total Damage</strong></td>
    <td><strong>${totalBaseMin}</strong></td>
    <td><strong>${totalBaseMax}</strong></td></tr>
  `;

  let abilityLine = "";

  if (ability && ability.type === "boost") {
    const boostedMin = Math.round(totalBaseMin * (1 + ability.percent / 100) * 10) / 10;
    const boostedMax = Math.round(totalBaseMax * (1 + ability.percent / 100) * 10) / 10;
    tableRows = `
      <tr><td><strong>Total Icons</strong></td>
      <td><strong>${totalMin}</strong></td>
      <td><strong>${totalMax}</strong></td></tr>
    `;

abilityLine = `
  <table>
    <tbody>
      <tr>
        <td><strong>${abilityName}</strong></td>
        <td colspan="2"><strong>${boostedMin} – ${boostedMax}</strong></td>
      </tr>
    </tbody>
  </table>
`;
  }

  const tableHTML = `
    <table>
      <thead>
        <tr><th>Icon Type</th><th>Min</th><th>Max</th></tr>
      </thead>
      <tbody>
        ${rows}
        <tr>
          <td><strong>Total Icons</strong></td>
          <td><strong>${totalMin}</strong></td>
          <td><strong>${totalMax}</strong></td>
        </tr>
      </tbody>
    </table>
    <table>
      <tbody>
<tr>
  <td><strong>Total Damage</strong></td>
  <td colspan="2"><strong>${totalBaseMin} - ${totalBaseMax}</strong></td>
</tr>
      </tbody>
    </table>
  `;

  const resultText = `
    <p><strong>Weapon 1:</strong> ${p1.name}</p>
    <p><strong>Weapon 2:</strong> ${p2.name}</p>
    <p><strong>Strength Modifier:</strong> x${multiplier}</p>
    ${tableHTML}
    ${abilityLine}
  `;

  document.getElementById("result").innerHTML = resultText;
  
// Opponent Weapon Icon Total
const opponentIcons = {
  air: 0, dark: 0, earth: 0, fire: 0, light: 0, water: 0, physical: 0
};

for (let i = 1; i <= 8; i++) {
  const select = document.getElementById(`opponentWeapon${i}`);
  const weaponName = select.value;
  const weapon = weapons.find(w => w.name === weaponName);
  if (weapon) {
    for (const type of Object.keys(opponentIcons)) {
      opponentIcons[type] = Math.max(opponentIcons[type], weapon[type] || 0);
    }
  }
}

// Max Icons
const playerIcons = {
  air: 0, dark: 0, earth: 0, fire: 0, light: 0, water: 0, physical: 0
};

for (let i = 1; i <= 8; i++) {
  const select = document.getElementById(`weapon${i}Select`);
  const weaponName = select?.value;
  const weapon = weapons.find(w => w.name === weaponName);
  if (weapon) {
    for (const type of Object.keys(playerIcons)) {
      playerIcons[type] = Math.max(playerIcons[type], weapon[type] || 0);
    }
  }
}

// Damage Visual Map
const chartColors = Object.keys(playerIcons).map(type => iconColors[type] || "#000");
const chartLabels = Object.keys(playerIcons).map(type => type.charAt(0).toUpperCase() + type.slice(1));
const playerData = Object.values(playerIcons);
const opponentData = Object.values(opponentIcons);

const ctx = document.getElementById("iconChart").getContext("2d");

if (window.iconChartInstance) {
  window.iconChartInstance.destroy();
}

window.iconChartInstance = new Chart(ctx, {
  type: 'radar',
  data: {
    labels: chartLabels,
    datasets: [
      {
        label: 'P1',
        data: playerData,
        backgroundColor: 'rgba(100, 149, 237, 0.2)',
        borderColor: 'rgba(100, 149, 237, 1)',
        pointBackgroundColor: chartColors
      },
      {
        label: 'P2',
        data: opponentData,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        pointBackgroundColor: 'rgba(255, 99, 132, 1)'
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: true },
      background: {
        color: 'rgba(255, 255, 255, 0.95)'
      }
    },
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        ticks: {
          stepSize: 1,
          backdropColor: 'transparent'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }
    }
  },
});
}

let currentSort = { key: null, asc: true };

function sortWeaponsBy(key) {
  const getWeaponValue = (weapon, key) => {
    if (key === "name") return weapon.name.toLowerCase();
    if (key.startsWith("def_")) {
      const type = key.split("_")[1];
      return weapon.defense?.[type] || 0;
    }
    return weapon[key] || 0;
  };

  if (currentSort.key === key) {
    currentSort.asc = !currentSort.asc;
  } else {
    currentSort = { key, asc: true };
  }

  const sortedWeapons = weapons
    .filter(w => w.name.toLowerCase() !== "none") // ✅ Exclude 'None'
    .sort((a, b) => {
      const valA = getWeaponValue(a, key);
      const valB = getWeaponValue(b, key);

      if (typeof valA === "string") {
        return currentSort.asc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return currentSort.asc ? valA - valB : valB - valA;
    });

  renderWeaponTable(sortedWeapons);
}

document.addEventListener("DOMContentLoaded", () => {
  populateWeaponDropdowns();
  populateMasterWeaponPanel();
  updateDefenseTable();
  simulate();

  document.querySelectorAll('#weaponPanel th[data-sort]').forEach(header => {
    header.addEventListener('click', () => {
      const sortKey = header.getAttribute('data-sort');
      sortWeaponsBy(sortKey);
    });
  });

  // Column Hover
  function enableColumnHighlighting(tableId, highlightClass) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const rows = Array.from(table.rows);
  rows.forEach(row => {
    Array.from(row.cells).forEach((cell, cellIndex) => {
      cell.addEventListener("mouseenter", () => {
        rows.forEach(r => {
          if (r.cells[cellIndex]) {
            r.cells[cellIndex].classList.add(highlightClass);
          }
        });
      });
      cell.addEventListener("mouseleave", () => {
        rows.forEach(r => {
          if (r.cells[cellIndex]) {
            r.cells[cellIndex].classList.remove(highlightClass);
          }
        });
      });
    });
  });
}
});


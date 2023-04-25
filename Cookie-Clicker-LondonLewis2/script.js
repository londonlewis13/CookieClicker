let cookies = 0;
let cookiesPerSecond = 0;

let building_costs = {
  'cursor' : 20,
  'grandma' : 100,
  'farm' : 500
};

let building_unlocks = {
  'cursor': false,
  'grandma': false,
  'farm' : false
};

let buildings_owned = {
  'cursor' : 0,
  'grandma' : 0,
  'farm' : 0
}

// cookies per second
let cps = {
  'cursor' : 0.1,
  'grandma' : 1,
  'farm' : 15
}

function cookie_clicked(event) {
  cookies += 1;
}

function reveal(building) {
  building_unlocks[building] = true;
  document.getElementById('label-' + building).innerText = building;
  document.getElementById('buy-' + building).classList.toggle('disabled');
}

function evalFrame() {
  // update cookie count
  document.getElementById('cookie').innerText = parseInt(cookies);
  
  // can I unlock anything yet?
  for(building in building_unlocks) {
    if(building_unlocks[building] == false && cookies >= building_costs[building] ) {
      console.log("Revealing", building);
      reveal(building);
    }
  }

  // toggle enabled buildings by cookie count vs cookie cost
  for(building in building_costs) {
    if(cookies < building_costs[building]) {
      document.getElementById('buy-' + building).classList.add('disabled');
    } else {
      document.getElementById('buy-' + building).classList.remove('disabled');
    }
  }
}

// buy a new building and increase cost for the next one
function buy(building) {
console.log('buy' , building);
  const growthFactor = 1.15;
  if(building_unlocks[building] && cookies >=  building_costs[building]) {
    cookies -= building_costs[building]
    building_costs[building] = parseInt(building_costs[building] * growthFactor);
    buildings_owned[building] += 1;
    document.getElementById('price-' + building).innerText = building_costs[building];
  }
}

function wipeSave() {
  cookies = 0;
  building_costs = {
    'cursor' : 20,
    'grandma' : 100,
    'farm' : 500
  };
  building_unlocks = {
    'cursor': false,
    'grandma': false,
    'farm' : false
   
  };
  localStorage.removeItem('save');
}

function saveGame() {
  const game = {
    cookies,
    building_costs,
    building_unlocks,
    buildings_owned
  }
  console.log("Save game:", game);
  localStorage.setItem('save', JSON.stringify(game));
}

function updateCookieCount() {
  for(building in buildings_owned) {
    cookies += buildings_owned[building] * cps[building];
  }
}

setInterval(evalFrame, 4); // delay in milliseconds

setInterval(saveGame, 60000); // every minute

setInterval(updateCookieCount, 1000);

// event that fires when the page loads
window.onload = function() {
  if(localStorage.getItem('save') !== null) {
    const save = JSON.parse(localStorage.getItem('save'));
    cookies = save.cookies;
    building_costs = save.building_costs;
    building_unlocks = save.building_unlocks; 
    buildings_owned = save.buildings_owned;
  }
}
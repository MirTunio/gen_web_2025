let x, y, dx, dy;
let listx, listy;  // declare without initializing

function setup() {
  createCanvas(600, 902);
  background(250);
  dx = width / 4;
  dy = height / 4;

  // initialize arrays after p5.js is ready
  listx = new Array(floor(600 / 4));
  listy = new Array(floor(902 / 4));

  // fill listx
  for (let a = 0; a < listx.length; a++) {
    listx[a] = (a + 1) * 10;
  }

  // duplicate loop like original
  for (let a = 0; a < listx.length; a++) {
    listx[a] = (a + 1) * 10;
  }

  shuffle(listx);
  shuffle(listy);

  stroke(0, 10);
}

function draw() {
  for (let i = 0; i < listx.length; i++) {
    for (let j = 0; j < listy.length; j++) {
      point(listx[i] + 0.375 * width, listy[j] + 0.375 * height);
    }
  }

  shuffle(listx);
  shuffle(listy);
}

// faithful shuffle function
function shuffle(value) {
  let temp;
  let pick;
  for (let i = 0; i < value.length; i++) {
    pick = floor(random(value.length));
    temp = value[i];
    value[i] = pick;   // preserves original bug
    value[pick] = temp;
  }
}

function setup(){
  createCanvas(600, 900);
  background(246);
  dx = width / 4;
  dy = height / 4;
}

function draw(){
  let x = random(dx) - dx / 2;
  let y = random(dy) - dy / 2;
  point(width / 2 + x, height / 2 + y);
}
// TUNIO 2024
// Braid (Braid11)

let t = 0;
let trigger = 0;

function setup() {
  createCanvas(960, 540);
  //background(255);
  background(237,225,199);
  //smooth();
}

function draw() {
  background(237,225,199);
  
  alt = 0;
  numvert = 65;
  pitch = ((width / numvert)/2);
  gross_shift = 0.4 * pitch;
  shifta = -3 * pitch + 35 * pitch;//+ pitch * floor((width * (noise(t/30) - 0.5))/pitch);
  for (let i=-10; i < width+1; i+=width/numvert) {
    if(abs(i-(width/2) - shifta) < (pitch + 5)){
      trigger = 1;
    } else {
      trigger = 0;
    }
    this_shift = trigger * (pitch * (alt%2) + -pitch * ((alt+1)%2));
    vertline(i + gross_shift, height * noise(t/60 + i/100), this_shift); // (1.5 * height - height/4)
    alt += 1;
  }

  t += 0.1;
  stroke(0.2);
  noFill();
  rect(0, 0, width, height);
  
}

function vertline(xpos, inflect, shift) {
  res = 200;
  if( shift != 0){
    //stroke(93, 131, 224); // complementary blue
    //stroke(223, 46, 7); // mat red
    //strokeWeight(1.85);
    
    
    stroke(0);
    strokeWeight(1.75);
    shake_factor = 0.75;
    
  } else {
    stroke(0);
    strokeWeight(1.75);
    shake_factor = 0.75;
  }
  noFill();
  beginShape();

  for (let i=0; i < res + 1; i++) {
    let this_y = i * height/res;
    //shake = shake_factor * 2.5 * (noise(this_y/50 + xpos * 100, t/5)-0.5);
    shake = shake_factor * 2.5 * (noise(this_y/50 + xpos * 100 + t/5)-0.5);


    if (abs(this_y - inflect) <= 30) {
      phase = (PI/2) * (this_y - inflect) / 30;
      vertex(xpos + shift + shift * sin(phase) + shake, this_y); // the infection curve could change
    } else {
      if ((this_y - inflect) < 0) {
        vertex(xpos + shake, this_y);
      } else {
        vertex(xpos + shift + shift + shake, this_y);
      }
    }
  }
  endShape();
}
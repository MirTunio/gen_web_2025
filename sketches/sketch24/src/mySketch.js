// TUNIO 2023
// 1s/s
// One second per second

let t = 0;
let amp = 1.0;
let capture;
let facePoints = [];
p5.disableFriendlyErrors = true;

function setup() {
  mindim = min(windowWidth, windowHeight);
  createCanvas(mindim - mindim/25, mindim - mindim/25);
  //createCanvas(600, 600);
  background(255);
  frameRate(60); // debug
}

function draw() {
  // clean canvas
  fill(255, 255);
  rect(0, 0, width, height);

  // Display the field
  current_time = get_current_time();
  
  fill(0);
  noStroke();
  textStyle(NORMAL);
  textSize(13.3);
  textAlign(LEFT, TOP);
  
  fidx = 0;
  fidy = 1;
  dex = 0;
  center_x = 0;
  center_y = 0;

  while(true){
    while(true){      
      phase = get_phase(fidx, fidy, t); // phase adjust (magic is here)
      full_time = get_full_time(current_time, phase);
      
      // print the time to screen
      push();      
      fill(0);
      noStroke();
      textStyle(NORMAL);
      textSize(13.3);
      textAlign(LEFT, TOP);
      second_str = format_time(full_time, true);
      text(second_str, fidx, fidy+3);
      fidx += textWidth(second_str) - textWidth(':');
      pop();

      if(dist(fidx,fidy,width/2,height/2) < 10){
        push();
        stroke(0,0,255);
        strokeWeight(20);
        center_x = fidx;
        center_y = fidy;
        pop();
      }
      
      dex += 1;
      
      // move to next line if needed
      if(fidx > width){
        fidy += 12;//textAscent(second_str);
        fidx = 0;
        break;
      }
    }   
    if(fidy > height){
      fidy = 0;
      fidx = 0;
      break;
    }
  }

  // centerpiece
  center_phase = get_phase(center_x, center_y, t);
  show_full = format_time(get_full_time(current_time, center_phase), false);
  push();
  rectMode(LEFT, TOP);
  fill(255);
  noStroke();
  rect(center_x - 52, center_y + 3, textWidth(show_full)+1.5, 12); // 12 is ascent 
  pop();
  fill(255, 0, 0);
  text(show_full, center_x - 51.5, center_y + 3);

  t += 0.01;
  
  // mask to octagon mask
  push();
  noStroke();
  fill(255);
  polymask(width/2, height/2, width/(1.86), 8);
  pop();
  
  ////////////////////////////////////
  //// FPS COUNTER
  //fill(255);
  //rect(width - 100, height - 30, 200, 50);
  //fill(0,0,255);
  //textSize(22);
  //fps = frameRate();
  //textAlign(CENTER, CENTER);
  //text("FPS: " + fps.toFixed(0), width - 50, height - 10);
}

function get_phase(xloc, yloc, t){
  phase = 0;
  flag = 'none';
  phase += 60000 * (noise(xloc/width, yloc/height, t) - 0.50); // t move noise field
  phase += 0.05 * (xloc + yloc * xloc); // t move noise field
  phase += dist(width/2, height/2, fidx, fidy) * tan(0.1*fidx/(fidy+10));
  amp = pow((1 + sin(t)) / 2, 2);
  phase *= amp;
  return phase;
}

function format_time(full_time, only_second){
  hoursInDay = full_time[0];
  minutesInHour = full_time[1];
  secondsInMinute = full_time[2];
  if(only_second){
    return `:${nf(secondsInMinute, 2)} `;
  } else {
    return `${nf(hoursInDay, 2)}:${nf(minutesInHour, 2)}:${nf(secondsInMinute, 2)}`;
  }
}

function get_full_time(currentTime, phase){
  currentTime += phase; // phase in milliseconds
  seconds = Math.floor(currentTime / 1000);
  secondsInMinute = seconds % 60;
  minutesInHour = Math.floor(seconds / 60) % 60;
  hoursInDay = Math.floor(seconds / 3600) % 24;
  return [hoursInDay, minutesInHour, secondsInMinute];
}

function get_current_time(){
  currentTime = new Date().getTime();
  timeZoneOffset = new Date().getTimezoneOffset() * 60;
  currentTime -= timeZoneOffset * 1000;
  return currentTime;
}

function polymask(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  let sy = 0;
  let sx = 0;
  for (let a = 0 +(TWO_PI/npoints)/2; a < TWO_PI + (TWO_PI/npoints)/2; a += angle) { //  
    sx = x + cos(a) * radius;
    sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  vertex(width, sy);
  vertex(width, 0);
  vertex(0, 0);
  vertex(0, height);
  vertex(width, height);
  vertex(width, sy);
  endShape();
}


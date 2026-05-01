// TUNIO 2026
// Stillness 

let path = [[102,403],[96,395],[91,386],[85,378],[79,370],[74,362],[70,352],[68,343],[66,333],[64,323],[64,313],[63,303],[62,293],[62,283],[63,273],[64,263],[66,254],[69,244],[72,234],[74,225],[76,215],[78,205],[80,195],[83,186],[87,176],[90,167],[92,157],[94,147],[97,138],[98,128],[99,118],[99,108],[100,98],[101,88],[102,78],[104,68],[106,59],[109,49],[116,42],[123,35],[132,30],[141,26],[151,26],[160,28],[169,32],[178,37],[186,42],[194,48],[203,54],[211,59],[220,64],[229,69],[238,73],[247,76],[257,78],[267,78],[277,79],[286,82],[295,87],[304,92],[312,97],[320,103],[327,110],[333,118],[340,125],[348,131],[356,137],[364,143],[372,149],[380,155],[388,161],[397,167],[405,172],[413,178],[422,183],[430,189],[438,195],[446,200],[454,206],[462,212],[471,218],[479,224],[487,229],[494,236],[496,245],[495,255],[491,264],[486,273],[481,282],[476,290],[471,299],[467,308],[462,316],[457,325],[452,334],[444,340],[435,344],[425,346],[415,348],[406,350],[396,352],[386,354],[376,356],[366,358],[357,360],[347,362],[337,364],[327,367],[318,369],[308,372],[298,374],[289,377],[279,379],[269,382],[260,384],[250,387],[240,389],[230,391],[221,393],[211,395],[201,397],[191,399],[181,401],[172,403],[162,405],[152,406],[142,407],[132,408],[122,407],[112,405],[103,403]];
let og_path = [[102,403],[96,395],[91,386],[85,378],[79,370],[74,362],[70,352],[68,343],[66,333],[64,323],[64,313],[63,303],[62,293],[62,283],[63,273],[64,263],[66,254],[69,244],[72,234],[74,225],[76,215],[78,205],[80,195],[83,186],[87,176],[90,167],[92,157],[94,147],[97,138],[98,128],[99,118],[99,108],[100,98],[101,88],[102,78],[104,68],[106,59],[109,49],[116,42],[123,35],[132,30],[141,26],[151,26],[160,28],[169,32],[178,37],[186,42],[194,48],[203,54],[211,59],[220,64],[229,69],[238,73],[247,76],[257,78],[267,78],[277,79],[286,82],[295,87],[304,92],[312,97],[320,103],[327,110],[333,118],[340,125],[348,131],[356,137],[364,143],[372,149],[380,155],[388,161],[397,167],[405,172],[413,178],[422,183],[430,189],[438,195],[446,200],[454,206],[462,212],[471,218],[479,224],[487,229],[494,236],[496,245],[495,255],[491,264],[486,273],[481,282],[476,290],[471,299],[467,308],[462,316],[457,325],[452,334],[444,340],[435,344],[425,346],[415,348],[406,350],[396,352],[386,354],[376,356],[366,358],[357,360],[347,362],[337,364],[327,367],[318,369],[308,372],[298,374],[289,377],[279,379],[269,382],[260,384],[250,387],[240,389],[230,391],[221,393],[211,395],[201,397],[191,399],[181,401],[172,403],[162,405],[152,406],[142,407],[132,408],[122,407],[112,405],[103,403]];
let cur = 1;
let og_len = path.length;

let scaleX = 0.5;  // 60% of original width
let scaleY = 0.3;  // 30% of original height (squished)
let centerX = 0;
let centerY = 0;
let ydisp = 0;

let vid;

// function preload() {
//   vid = createVideo('reference/test2.mp4');
//   test2.webm
// }

let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function preload() {
    vid = createVideo(['reference/test2.webm', 'reference/test2.mp4']);
  // if (isMobile) {
  //   vid = createVideo('reference/test2.webm');
  // } else {
  //   vid = createVideo('reference/test2.mp4');
  // }
}

function setup() {
  createCanvas(554, 442);
  background(20);
  frameRate(20);
  centerX = width / 2;
  centerY = height / 2;
  ydisp = height/3;
  
  vid.hide();
  vid.volume(0);
  
  // Explicitly set muted attribute - critical for Firefox autoplay
  vid.elt.muted = true;
  vid.elt.setAttribute('muted', '');
  vid.elt.setAttribute('playsinline', '');  // iOS Safari needs this
  vid.elt.setAttribute('autoplay', '');
  
  vid.loop();
  
  // Try to play, catch any rejection (some browsers return a Promise)
  let playPromise = vid.elt.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.log('Autoplay prevented:', error);
    });
  }
}

function draw() {
  //background(20);
  let zoomLevel = 1.1;  // 1.1 = 10% zoom, 1.2 = 20% zoom, etc
  image(vid, -10, 0, width * zoomLevel, height * zoomLevel);
  //image(vid, 0, 0, width, height);
    
  strokeCap(SQUARE);
  noFill();
     
  stroke(255, 255, 255, 30);
  strokeWeight(15);
  beginShape();  
  for (let i = 0; i < cur; i++) {
    let progress = i / og_len;
    let x = centerX + (path[i][0] - 277) * scaleX;
    let y = centerY + (path[i][1] - 220) * scaleY - (progress * 20) + ydisp;
    x = x + 4*(noise(i/10)-0.5);
    y = y + 4*(noise(i/10+5000)-0.5);
    curveVertex(x, y);
  }
  endShape();
  
  stroke(255, 255, 255, 90);
  strokeWeight(9);
  beginShape();  
  for (let i = 0; i < cur; i++) {
    let progress = i / og_len;
    let x = centerX + (path[i][0] - 277) * scaleX;
    let y = centerY + (path[i][1] - 220) * scaleY - (progress * 20) + ydisp;
    x = x + 4*(noise(i/10)-0.5);
    y = y + 4*(noise(i/10+5000)-0.5);
    curveVertex(x, y);
  }
  endShape();
  
  stroke(255, 255, 255, 180);
  strokeWeight(5);
  beginShape();  
  for (let i = 0; i < cur; i++) {
    let progress = i / og_len;
    let x = centerX + (path[i][0] - 277) * scaleX;
    let y = centerY + (path[i][1] - 220) * scaleY - (progress * 20) + ydisp;
    x = x + 4*(noise(i/10)-0.5);
    y = y + 4*(noise(i/10+5000)-0.5);
    curveVertex(x, y);
  }
  endShape();
  
  stroke(255, 255, 255, 255);
  strokeWeight(3);
  beginShape();  
  for (let i = 0; i < cur; i++) {
    let progress = i / og_len;
    let x = centerX + (path[i][0] - 277) * scaleX;
    let y = centerY + (path[i][1] - 220) * scaleY - (progress * 20) + ydisp;
    x = x + 4*(noise(i/10)-0.5);
    y = y + 4*(noise(i/10+5000)-0.5);
    curveVertex(x, y);
  }
  endShape();  
  
  
  cur += 1;
  if (cur%path.length==0){
    path = path.concat(og_path)
  }
  
  if(frameCount > 2200){
    noLoop();
  }
  //text(frameCount, width - 150, height - 10);
}

function mousePressed() {
  if (vid.elt.paused) {
    vid.loop();
  }
}



let t = 0;
let stickers = [];

function setup() {
  createCanvas(600, 400);
  noSmooth();
}

function draw(){
  background(255);
  stroke(0);
  strokeWeight(0.5);
  rect(0,0,width,height);

  maybeSpawnSticker();
  drawRoom(t);
  t += 0.01;
}

/* ---------------- Stickers ---------------- */

function maybeSpawnSticker(){
  if (random() < 0.01) {
    const walls = ['back','left','right','floor','ceiling'];
    const wall = random(walls);
    const su = random(0.16, 0.48);
    const sv = random(0.12, 0.44);
    const margin = 0.07;
    const u0 = random(margin, 1 - margin - su);
    const v0 = random(margin, 1 - margin - sv);

    // Compute the wall normal based on wall type
    let N = getWallNormal(wall);

    // Pick a random rotation vector in hemisphere of N
    let rotvec = randomRotateHemisphere(N, PI/4);

    // Random scan direction: +1 or -1
    let dir = random([1, -1]);

    stickers.push({
      wall,
      u0, v0, su, sv,
      born: millis(),
      dur: random(5000, 12000),
      rotvec,   // rotation vector
      dir       // scan direction
    });
  }
}


function drawWallStickers(wallName, quad3D, project){
  for (let i = stickers.length - 1; i >= 0; i--){
    const s = stickers[i];
    if (s.wall !== wallName){
      continue;
    }

    const age = millis() - s.born;
    const a = map(age, 0, s.dur, 220, 0, true);
    if (a <= 0){
      stickers.splice(i, 1);
      continue;
    }

    // Sticker corners in 3D
    const P0 = bilerp3D(quad3D, s.u0,       s.v0);
    const P1 = bilerp3D(quad3D, s.u0+s.su,  s.v0);
    const P2 = bilerp3D(quad3D, s.u0+s.su,  s.v0+s.sv);
    const P3 = bilerp3D(quad3D, s.u0,       s.v0+s.sv);

    // Compute inward normal for this wall
    let N = inwardNormal(quad3D);
    if (wallName == 'floor'){
      N = N.mult(-1);
    }
    if (wallName == 'ceiling'){
      N = N.mult(-1);
    }
    if (wallName == 'right'){
      N = N.mult(-1);
    }
    if (wallName == 'back'){
      N = N.mult(-1);
    }
    
    let scan = map(age, 0, s.dur, -PI/4, PI/4, true);
    scan *= s.dir;
    // Use the sticker's stored rotvec instead of recalculating
    N = rotateVectorAroundAxis(N, s.rotvec, scan);
    
    if (wallName == 'back'){
    } else {
      N.rotate(scan);
    }
    

    // How far shadow extends into room (scans over lifetime)
    const prog = age / s.dur;
    const depth = lerp(200, 800, prog);

    // Extrude far quad
    const E0 = p5.Vector.add(P0, p5.Vector.mult(N, depth));
    const E1 = p5.Vector.add(P1, p5.Vector.mult(N, depth));
    const E2 = p5.Vector.add(P2, p5.Vector.mult(N, depth));
    const E3 = p5.Vector.add(P3, p5.Vector.mult(N, depth));

    // Project to 2D
    const p0 = project(P0), p1 = project(P1), p2 = project(P2), p3 = project(P3);
    const e0 = project(E0), e1 = project(E1), e2 = project(E2), e3 = project(E3);

    // --- Draw shadow volume as 4 side quads ---
    noStroke();
    fill(0, a * 0.70);
    quad(p0.x,p0.y,p1.x,p1.y,e1.x,e1.y,e0.x,e0.y);
    quad(p1.x,p1.y,p2.x,p2.y,e2.x,e2.y,e1.x,e1.y);
    quad(p2.x,p2.y,p3.x,p3.y,e3.x,e3.y,e2.x,e2.y);
    quad(p3.x,p3.y,p0.x,p0.y,e0.x,e0.y,e3.x,e3.y);

    // --- Sticker itself ---
    fill(0, a);
    quad(p0.x,p0.y,p1.x,p1.y,p2.x,p2.y,p3.x,p3.y);
  }
}

function bilerp3D(q, u, v){
  const a = q[0], b = q[1], c = q[2], d = q[3];
  const x = (1-u)*(1-v)*a.x + u*(1-v)*b.x + u*v*c.x + (1-u)*v*d.x;
  const y = (1-u)*(1-v)*a.y + u*(1-v)*b.y + u*v*c.y + (1-u)*v*d.y;
  const z = (1-u)*(1-v)*a.z + u*(1-v)*b.z + u*v*c.z + (1-u)*v*d.z;
  return createVector(x, y, z);
}

// Compute inward-facing normal of a wall from 3D quad
function inwardNormal(quad){
  const u = p5.Vector.sub(quad[1], quad[0]);
  const v = p5.Vector.sub(quad[3], quad[0]);
  let n = p5.Vector.cross(u,v).normalize();
  // Flip if pointing outward (we want into room → +z toward camera)
  if (n.z > 0){
    n.mult(-1);
  }
  return n;
}

/* ---------------- Room ---------------- */

function wall_bump(t, rno){
  let delta = 30;
  translate(delta*noise(t+1372+rno)-5,
            delta*noise(t+5718+rno)-5,
            delta*noise(t+2324+rno)-5);
}
function wall_restore(t, rno){
  let delta = 30;
  translate(-1*delta*noise(t+1372+rno)+5,
            -1*delta*noise(t+5718+rno)+5,
            -1*delta*noise(t+2324+rno)+5);
}

function drawRoom(t) {
  push();
  translate(width/2, height/2);

  let s = 280;
  let pts3D = {
    LBF: createVector(-s*1.5, -s,  s),
    LTF: createVector(-s*1.5,  s,  s),
    RBF: createVector( s*1.5, -s,  s),
    RTF: createVector( s*1.5,  s,  s),
    LBN: createVector(-s*1.5, -s*0.8, -s), 
    LTN: createVector(-s*1.5,  s*0.8, -s),
    RBN: createVector( s*1.5, -s*0.8, -s),
    RTN: createVector( s*1.5,  s*0.8, -s),
  };

  let pts = {};
  for (let key in pts3D) pts[key] = project(pts3D[key]);

  // Back wall
  wall_bump(t, 2812);
  fill(150, 80); stroke(0);
  const back3D = [pts3D.LBN, pts3D.RBN, pts3D.RTN, pts3D.LTN];
  const back2D = [pts.LBN, pts.RBN, pts.RTN, pts.LTN];
  quadPts(back2D); drawWallStickers('back', back3D, project);
  wall_restore(t, 2812);

  // Left wall
  wall_bump(t, 7291);
  fill(255,255,255,190); stroke(0);
  const left3D = [pts3D.LBN, pts3D.LTN, pts3D.LTF, pts3D.LBF];
  const left2D = [pts.LBN, pts.LTN, pts.LTF, pts.LBF];
  quadPts(left2D); drawWallStickers('left', left3D, project);
  wall_restore(t, 7291);

  // Right wall
  wall_bump(t, 214);
  fill(255,255,255,190); stroke(0);
  const right3D = [pts3D.RBN, pts3D.RTN, pts3D.RTF, pts3D.RBF];
  const right2D = [pts.RBN, pts.RTN, pts.RTF, pts.RBF];
  quadPts(right2D); drawWallStickers('right', right3D, project);
  wall_restore(t, 214);

  // Floor
  wall_bump(t, 10129);
  fill(180,190); stroke(0);
  const floor3D = [pts3D.LBN, pts3D.RBN, pts3D.RBF, pts3D.LBF];
  const floor2D = [pts.LBN, pts.RBN, pts.RBF, pts.LBF];
  quadPts(floor2D); drawWallStickers('floor', floor3D, project);
  wall_restore(t, 10129);

  // Ceiling
  wall_bump(t, 15023);
  fill(255,255,255,190); stroke(0);
  const ceiling3D = [pts3D.LTN, pts3D.RTN, pts3D.RTF, pts3D.LTF];
  const ceiling2D = [pts.LTN, pts.RTN, pts.RTF, pts.LTF];
  quadPts(ceiling2D); drawWallStickers('ceiling', ceiling3D, project);
  wall_restore(t, 15023);

  pop();
}

function quadPts(q){
  quad(q[0].x,q[0].y,q[1].x,q[1].y,q[2].x,q[2].y,q[3].x,q[3].y);
}

function project(v) {
  let d = 800, zCam = 500;
  let scale = d / (d - (v.z - zCam));
  return createVector(v.x * scale, -v.y * scale);
}

function rotateVectorAroundAxis(v, axis, angle){
  let k = axis.copy().normalize();
  let cosA = cos(angle), sinA = sin(angle);
  return p5.Vector.add(
    p5.Vector.mult(v, cosA),
    p5.Vector.add(
      p5.Vector.mult(p5.Vector.cross(k, v), sinA),
      p5.Vector.mult(k, p5.Vector.dot(k, v) * (1 - cosA))
    )
  );
}

function randomRotateHemisphere(N, maxAngle) {
  // Pick a vector perpendicular to N
  let tangent;
  if (abs(N.x) < 0.1 && abs(N.y) < 0.1) {
    tangent = createVector(0, 1, 0).cross(N).normalize();
  } else {
    tangent = createVector(0, 0, 1).cross(N).normalize();
  }

  // Pick a random direction in the plane perpendicular to N
  let phi = random(0, TWO_PI);
  let axis = p5.Vector.add(
    p5.Vector.mult(tangent, cos(phi)),
    p5.Vector.cross(N, tangent).mult(sin(phi))
  ).normalize();

  // Random rotation angle within maxAngle
  let theta = random(0, maxAngle);

  // Rodrigues' rotation formula
  let N_rot = p5.Vector.add(
    p5.Vector.mult(N, cos(theta)),
    p5.Vector.add(
      p5.Vector.mult(p5.Vector.cross(axis, N), sin(theta)),
      p5.Vector.mult(axis, p5.Vector.dot(axis, N) * (1 - cos(theta)))
    )
  ).normalize();

  return N_rot;
}

// Utility to return approximate normal vector for the wall
function getWallNormal(wall) {
  switch(wall){
    case 'back': return createVector(0,0,-1);
    case 'left': return createVector(-1,0,0);
    case 'right': return createVector(1,0,0);
    case 'floor': return createVector(0,-1,0);
    case 'ceiling': return createVector(0,1,0);
  }
}

sometimes = 1.5;
I = 50;
wonder = 0;
Why = 0;
DontTearAway = 0;
Please = 0;
cleave = 0;
Loss = 35;

function setup(){
createCanvas(650,350);
background(255);
strokeWeight(2);
}

function draw(){
Please = 0;
fill(220,100,100,40);
rect(-1,-1,width+2,height+2);
stroke(275-DontTearAway*5);
for(let i = -20; i < height+20; i += 4){
if(DontTearAway > 10){
cleave = (100/(i-height/2))*(DontTearAway-10);
}
wist(i+cleave);
}
DontTearAway+=0.06;
Loss += 0.15;
}

function wist(her){
PleaseDontTearAway = DontTearAway + Please;

beginShape();
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
DoesThisMeanAnythingToYou(-I+wonder,Loss*(noise(PleaseDontTearAway+Why)-0.5)+her);
wonder += I;
Why += sometimes;
endShape();

wonder = 0;
Why = 0;
Please += 10;
}

function DoesThisMeanAnythingToYou(I, hope){
curveVertex(I,hope);
}

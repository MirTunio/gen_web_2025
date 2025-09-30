// TUNIO 2021
// OLLA

var t = 0;
let WIDTH = 480;
let HEIGHT = 480;

function setup() {
	createCanvas(WIDTH, HEIGHT);
	frameRate(60);
	noStroke();
	fill(0, 100);
	rect(0, 0, width / 2, height);
	fill(240, 200, 200, 100);
	rect(width / 2, 0, width / 2, height);
	frameRate(14);
}

function draw() {
	noStroke();
	fill(0, 24);
	rect(0, 0, width / 2, height);
	fill(0, 24);
	triangle(width / 2, height / 2 - 3 - 720 * 0.66 * 0.375,
		width / 2 + 7.5, height / 2 - 720 * 0.66 * 0.375,
		width / 2, height / 2 + 3 - 720 * 0.66 * 0.375);
	triangle(width / 2, height / 2 - 3 - 640 * 0.66 * 0.375,
		width / 2 + 7.5, height / 2 - 640 * 0.66 * 0.375,
		width / 2, height / 2 + 3 - 640 * 0.66 * 0.375);
	fill(240, 200, 200, 12);
	triangle(width / 2, height / 2 - 3 + 720 * 0.66 * 0.375,
		width / 2 - 7.5, height / 2 + 720 * 0.66 * 0.375,
		width / 2, height / 2 + 3 + 720 * 0.66 * 0.375);
	triangle(width / 2, height / 2 - 3 + 640 * 0.66 * 0.375,
		width / 2 - 7.5, height / 2 + 640 * 0.66 * 0.375,
		width / 2, height / 2 + 3 + 640 * 0.66 * 0.375);
	rect(width / 2, 0, width / 2, height);

	strokeWeight(8);
	stroke(240, 200, 200, 26);
	line(width / 2 * noise(t), 0,
		width / 2 * noise(t), height);

	stroke(0, 24);
	line(width / 2 + width / 2 * noise(t+21219), 0,
		width / 2 + width / 2 * noise(t+21219), height);

	t += 0.1;
}
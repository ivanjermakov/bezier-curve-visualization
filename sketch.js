let w = 960;
let h = 540;

let dots = [];
let bezierDots = [];
let lines = [];

const totalSplines = 100;

class Dot {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

class Line {
	constructor(d1, d2) {
		this.d1 = d1;
		this.d2 = d2;
	}
}

function setup() {
	createCanvas(w, h);
	frameRate(0);
}

function draw() {
	noLoop();

	background(250);

	calculateBezier();

	showLines();
	showBezier();
	showDots();
}

function showDots() {
	push();
	rectMode(1);
	strokeWeight(0);
	fill(255, 0, 0);
	dots.forEach(d => {
		ellipse(d.x, d.y, 5);
	});
	pop();
}

function showBezier() {
	push();
	rectMode(1);
	stroke(0, 100, 200);
	strokeWeight(2);
	noFill();
	beginShape();
	bezierDots.forEach(d => {
		vertex(d.x, d.y);
	});
	endShape();
	pop();
}

function showLines() {
	push();
	rectMode(1);
	stroke(150);
	noFill();
	beginShape();
	dots.forEach(d => {
		vertex(d.x, d.y);
	});
	endShape();
	pop();
}

function calculateBezier() {
	if (lines.length < 2) return;

	bezierDots = [];

	const delta = 1 / totalSplines;
	for (let f = 0; f < 1; f += delta) {
		const lastLine = getLastLine(lines, f);
		bezierDots.push(getLinePoint(lastLine, f));
	}
}

function getLastLine(lines, t) {
	if (lines.length === 1) {
		return lines[0];
	}

	const subLines = [];

	for (let i = 0; i < lines.length - 1; i++) {
		subLines.push(getSubLine(lines[i], lines[i + 1], t));
	}

	if (subLines.length === 1) {
		return subLines[0];
	} else {
		return getLastLine(subLines, t);
	}
}

function getLinePoint(line, t) {
	const dX = line.d2.x - line.d1.x;
	const dY = line.d2.y - line.d1.y;

	const x = line.d1.x + dX * (1 - t);
	const y = line.d1.y + dY * (1 - t);

	return new Dot(x, y);
}

function getSubLine(line1, line2, t) {
	const subLinePoint1 = getLinePoint(line1, t);
	const subLinePoint2 = getLinePoint(line2, t);

	return new Line(subLinePoint2, subLinePoint1);
}

function mouseClicked() {
	dots.push(new Dot(mouseX, mouseY));

	if (dots.length >= 2) {
		lines.push(new Line(dots[dots.length - 1], dots[dots.length - 2]));
	}

	draw();
}

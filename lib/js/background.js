var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var cw = canvas.width = window.innerWidth,
  cx = cw / 2;
var ch = canvas.height = window.innerHeight,
  cy = ch / 2;
var rad = Math.PI / 180;
ctx.strokeStyle = "#fff";
var frames = 0;
var requestId = null;
var particles = [];

var maxLength = 80;//trail length
var colors = ["213,117,240", "126,201,231", "143,214,166", "255,224,102", "255,105,102"]; // stars colors

function Particle() {
  this.x = 0;
  this.y = 0;
  this.r = 5;
  this.history = [];

  this.draw = function(func) {
    for (var i = 0; i < this.history.length; i++) {
      var o = this.history[i];
      o.x += o.d.x;
      o.y += o.d.y;
      o.alp -= 1.01 / maxLength;
      o.r += .3;
      func(o);// stars or hearts or dots
    }
  }

  this.update = function(t) {
    // t = time
    this.x = cx + Math.cos(t / 43 + Math.cos(t / 47 + frames * rad)) * (cx - 10 * this.r);
    this.y = cy + Math.sin(t / 31 + Math.cos(t / 37 + frames * rad)) * (cy - 10 * this.r);

    var moment = {
      x: this.x,
      y: this.y,
      r: this.r,
      a: Math.random() * 360,
      alp: 1,
      rgb: colors[~~(Math.random() * (colors.length))],
      d: {
        x: randomIntFromInterval(-1, 1),
        y: randomIntFromInterval(-1, 1)
      }
    }
    this.history.push(moment);
    if (this.history.length > maxLength) {
      this.history.splice(0, 1);
    }
  }
}

for (var i = 0; i < 3; i++) {// 1 star, 1 heart, 1 dot
  var p = new Particle();
  particles.push(p);
}

function Draw() {
  requestId = window.requestAnimationFrame(Draw);
  ctx.clearRect(0, 0, cw, ch);
  frames++;
  t = new Date().getTime() / 127;

  particles[0].update(t);
  particles[1].update(t + 375);
  particles[2].update(t + 743);
  particles[0].draw(stars);
  particles[1].draw(hearts);
  particles[2].draw(blueDots);
}
//Draw();

var Init = function() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  }
  cw = canvas.width = window.innerWidth,
    cx = cw / 2;
  ch = canvas.height = window.innerHeight,
    cy = ch / 2;

  Draw();
}

window.setTimeout(function() {
  Init();
  window.addEventListener('resize', Init, false);
}, 15);




function stars(o) {
  ctx.fillStyle = "rgba(" + o.rgb + ", " + o.alp + ")";
  var step = 2;
  var L = 5;
  var angle = (2 * Math.PI) / (L / step);
  ctx.beginPath();
  for (var i = 0; i < L; i++) {
    var x = o.x + o.r * Math.cos(angle * i);
    var y = o.y + o.r * Math.sin(angle * i);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

function hearts(o) {
  var x = o.x,
    y = o.y,
    r = o.r,
    a = o.a || -90,
    l = o.l;
  //ctx.fillStyle = "hsla(0,90%,50%,"+o.alp+")";
  ctx.fillStyle = oGrd(o, 0, 70, 50, 30)
  var x1 = x + r * Math.cos(a * rad);
  var y1 = y + r * Math.sin(a * rad);
  var cx1 = x + r * Math.cos((a + 22.5) * rad);
  var cy1 = y + r * Math.sin((a + 22.5) * rad);

  var cx2 = x + r * Math.cos((a - 22.5) * rad);
  var cy2 = y + r * Math.sin((a - 22.5) * rad);
  var chord = 2 * r * Math.sin(22.5 * rad / 2);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.arc(cx1, cy1, chord, (270 + a) * rad, (270 + a + 225) * rad);
  ctx.lineTo(x, y);
  ctx.moveTo(x1, y1);
  ctx.arc(cx2, cy2, chord, (90 + a) * rad, (90 + a + 135) * rad, true);
  ctx.lineTo(x, y);
  ctx.fill();
}

function blueDots(o) {

  ctx.fillStyle = oGrd(o, 180, 60, 40, 30)
  ctx.beginPath();
  ctx.arc(o.x, o.y, o.r, 0, 2 * Math.PI);
  ctx.fill();
}

function oGrd(o, h, n1, n2, n3) {
  grd = ctx.createRadialGradient(o.x - .2 * o.r, o.y - .6 * o.r, 0, o.x - .2 * o.r, o.y - .6 * o.r, o.r);
  grd.addColorStop(0, 'hsla(' + h + ',100%,' + n1 + '%,' + o.alp + ')');
  grd.addColorStop(0.4, 'hsla(' + h + ',100%,' + n2 + '%,' + o.alp + ')');
  grd.addColorStop(1, 'hsla(' + h + ',100%,' + n3 + '%,' + o.alp + ')');
  return grd;
}

function randomIntFromInterval(mn, mx) {
  return (Math.random() * (mx - mn + 1) + mn);
}

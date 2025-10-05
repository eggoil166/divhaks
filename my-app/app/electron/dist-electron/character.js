const char = document.getElementById("character");

let x = 70, y = 50;
let dx = 2.0, dy = 1.7;

function move() {
  x += dx;
  y += dy;
  if (x < 0 || x > window.innerWidth + 200) dx = -dx;
  if (y < 0 || y > window.innerHeight + 172) dy = -dy;
  char.style.left = x + "px";
  char.style.top = y + "px";
  requestAnimationFrame(move);
}
move();

//function follow the mouse --> default, every min go to random action: spin or hop
//document.addEventListener("mousemove", e => {
//  x = e.clientX - 100;
//  y = e.clientY - 86;
//  char.style.left = x + "px";
//  char.style.top = y + "px";
//});

//function spin in place
//setInterval(() => {
//  char.style.transform = `rotate(${(Date.now() / 10) % 360}deg)`;
//}, 16);

//hop up and down across the screen and go back the other way for x rand seconds

//run off screen and come back on other side after a few seconds

// Optional drag? can it drag the app window itself? at a set time of day?
// or can it drag a chrome browser window?
let dragging = false, offsetX, offsetY;

char.addEventListener("mousedown", e => {
  dragging = true;
  offsetX = e.clientX - x;
  offsetY = e.clientY - y;
  char.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  dragging = false;
  char.style.cursor = "grab";
});

window.addEventListener("mousemove", e => {
  if (dragging) {
    x = e.clientX - offsetX;
    y = e.clientY - offsetY;
    char.style.left = x + "px";
    char.style.top = y + "px";
  }
});
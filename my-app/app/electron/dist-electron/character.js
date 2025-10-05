const cat = document.getElementById("cat");

// start in center of screen
let x = window.innerWidth / 2 - 75;
let y = window.innerHeight / 2 - 75;
let targetX = x;
let targetY = y;
let dragging = false;
let offsetX = 0;
let offsetY = 0;

const ease = 0.08; 


document.addEventListener("mousemove", e => {
  targetX = e.clientX - 75;
  targetY = e.clientY - 75;
});

// drag cat
cat.addEventListener("mousedown", e => {
  dragging = true;
  offsetX = e.clientX - x;
  offsetY = e.clientY - y;
  cat.style.cursor = "grabbing";
});

window.addEventListener("mouseup", () => {
  dragging = false;
  cat.style.cursor = "grab";
});

window.addEventListener("mousemove", e => {
  if (dragging) {
    x = e.clientX - offsetX;
    y = e.clientY - offsetY;
    targetX = x; 
    targetY = y;
  }
});

function animate() {
  if (!dragging) {
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
  }

  // flip cat
  if (targetX - x < 0) {
    cat.style.transform = "translate(-50%, -50%) scaleX(-1)";
  } else {
    cat.style.transform = "translate(-50%, -50%) scaleX(1)";
  }

  cat.style.left = `${x}px`;
  cat.style.top = `${y}px`;

  requestAnimationFrame(animate);
}

animate();

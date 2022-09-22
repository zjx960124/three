import { OrbitControls } from "../libs/OrbitControls.js";
import { Lensflare, LensflareElement } from "../libs/Lensflare.js";

import { Rule } from "./rule.js";

// { x: 3000, y: 600, z: -1200 },
// { x: 800, y: 1300, z: -1800 },
const BALL_POSITION = [
  { x: 2700, y: 1200, z: 250 },
  { x: 0, y: 2800, z: -2500 },
  { x: -600, y: 0, z: -2500 },
  { x: -800, y: 1000, z: -2500 },
];
const clock = new THREE.Clock();

let container;
let camera, scene, renderer;
let controls;
let ball,
  ballPosition = Object.assign({}, BALL_POSITION[0]);
let otherBalls = [],
  otherBallsPosition = [];

let imageDirection = screen.width > screen.height ? "landscape" : "portrait";
let distance = screen.width;

let textureFlare0, textureFlare3;

init();
Rule.cheat();

function init() {
  container = document.createElement("div");
  document.body.appendChild(container);

  // camera
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    15000
  );
  camera.position.z = -250;

  // scene
  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(scene.background, 3500, 15000);

  // skybox
  scene.background = new THREE.CubeTextureLoader()
    .setPath("./images/skybox/")
    .load(
      ["posx.jpg", "negx.jpg", "posy.jpg", "negy.jpg", "posz.jpg", "negz.jpg"],
      () => {
        // lights
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.05);
        dirLight.position.set(0, -1, 0).normalize();
        dirLight.color.setHSL(0.1, 0.7, 0.5);
        scene.add(dirLight);

        // renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.outputEncoding = THREE.sRGBEncoding;
        container.appendChild(renderer.domElement);

        // controls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.target.copy(ballPosition);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.enableRotate = false;
        controls.enableZoom = false;

        // events
        window.addEventListener("resize", onWindowResize);

        animate();
        document.querySelector(".wish-buttons-wrapper").style.display = "block";
      }
    );
}

function onWindowResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// add light with lens flare
function addLight(h, s, l, x, y, z, size, append) {
  // lensflares
  const textureLoader = new THREE.TextureLoader();
  if (!textureFlare0) {
    textureFlare0 = textureLoader.load("images/lensflare/lensflare0.png");
  }
  if (!textureFlare3) {
    textureFlare3 = textureLoader.load("images/lensflare/lensflare3.png");
  }

  const light = new THREE.PointLight(0xffffff, 1.5, 2000);
  light.color.setHSL(h, s, l);
  light.position.set(x, y, z);
  scene.add(light);

  const lensflare = new Lensflare();
  lensflare.addElement(
    new LensflareElement(textureFlare0, size, 0, light.color)
  );
  if (!append) {
    if (imageDirection == "portrait") {
      lensflare.addElement(new LensflareElement(textureFlare3, 50, 0.7));
      lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.8));
      lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    } else {
      lensflare.addElement(new LensflareElement(textureFlare3, 30, 0.7));
      lensflare.addElement(new LensflareElement(textureFlare3, 40, 0.8));
      lensflare.addElement(new LensflareElement(textureFlare3, 50, 1));
    }
  }
  light.add(lensflare);
  return light;
}

// add wish ball
function addBall(type, count, size) {
  switch (type) {
    case "GOLD":
    case "SGOLD":
      ball = addLight(
        0.18,
        0.76,
        0.6,
        ballPosition.x,
        ballPosition.y,
        ballPosition.z,
        size
      );
      break;
    case "PURPLE":
      ball = addLight(
        0.72,
        0.76,
        0.6,
        ballPosition.x,
        ballPosition.y,
        ballPosition.z,
        size
      );
      break;
    case "BLUE":
      ball = addLight(
        0.58,
        0.76,
        0.6,
        ballPosition.x,
        ballPosition.y,
        ballPosition.z,
        size
      );
      break;
    default:
      ball = addLight(
        0,
        0,
        0,
        ballPosition.x,
        ballPosition.y,
        ballPosition.z,
        size
      );
      break;
  }
  for (let i = 0; i < count - 1; i++) {
    let x =
      i % 2 == 0
        ? ballPosition.x - distance + (Math.random() * distance) / 2
        : ballPosition.x + distance - (Math.random() * distance) / 2;
    let y =
      i % 2 == 0
        ? ballPosition.y - distance + (Math.random() * distance) / 2
        : ballPosition.y + distance - (Math.random() * distance) / 2;
    let z =
      i % 2 == 0
        ? ballPosition.z - distance + (Math.random() * distance) / 2
        : ballPosition.z + distance - (Math.random() * distance) / 2;
    let position = { x, y, z };
    otherBallsPosition.push(position);
    otherBalls.push(
      addLight(0.5, 0.46, 0.26, position.x, position.y, position.z, 180, true)
    );
  }
}

// tween animation
function ballTween(type, result) {
  const tweenA = new TWEEN.Tween(ballPosition)
    .to(BALL_POSITION[1], 1800)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onUpdate(() => {
      addBall("", 1, 100);
      controls.target.x = ballPosition.x;
      controls.target.y = ballPosition.y;
      controls.target.z = ballPosition.z;
    })
    .onComplete(() => {
      controls.target.copy(BALL_POSITION[3]);
    });

  let cameraPosition = Object.assign({}, BALL_POSITION[2]);
  const tweenB = new TWEEN.Tween(cameraPosition)
    .to(BALL_POSITION[3], 300)
    .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onUpdate(() => {
      addBall("", 1, 50);
      ball.position.copy(cameraPosition);
    })
    .onComplete(() => {
      addBall(type, 1, 600);
      ball.position.copy(cameraPosition);
      setTimeout(() => {
        showResult(result);
      }, 500);
    });

  tweenA.chain(tweenB).start();
}

// tween animation
function ballsTween() {
  let ballsDestination = [
    {
      x: BALL_POSITION[1].x - distance - (Math.random() * distance) / 2,
      y: BALL_POSITION[1].y - distance - (Math.random() * distance) / 2,
      z: BALL_POSITION[1].z - distance - (Math.random() * distance) / 2,
    },
    {
      x: BALL_POSITION[1].x - distance - (Math.random() * distance) / 2,
      y: BALL_POSITION[1].y + distance + (Math.random() * distance) / 2,
      z: BALL_POSITION[1].z - distance - (Math.random() * distance) / 2,
    },
    {
      x: BALL_POSITION[1].x - distance - (Math.random() * distance) / 2,
      y: BALL_POSITION[1].y + distance + (Math.random() * distance) / 2,
      z: BALL_POSITION[1].z - distance - (Math.random() * distance) / 2,
    },
    {
      x: BALL_POSITION[1].x - distance - (Math.random() * distance) / 2,
      y: BALL_POSITION[1].y + distance + (Math.random() * distance) / 2,
      z: BALL_POSITION[1].z + distance + (Math.random() * distance) / 2,
    },
    {
      x: BALL_POSITION[1].x + distance + (Math.random() * distance) / 2,
      y: BALL_POSITION[1].y - distance - (Math.random() * distance) / 2,
      z: BALL_POSITION[1].z - distance - (Math.random() * distance) / 2,
    },
    {
      x: BALL_POSITION[1].x + distance + (Math.random() * distance) / 2,
      y: BALL_POSITION[1].y + distance + (Math.random() * distance) / 2,
      z: BALL_POSITION[1].z - distance - (Math.random() * distance) / 2,
    },
    {
      x: BALL_POSITION[1].x + distance + (Math.random() * distance) / 2,
      y: BALL_POSITION[1].y - distance - (Math.random() * distance) / 2,
      z: BALL_POSITION[1].z + distance + (Math.random() * distance) / 2,
    },
    {
      x: BALL_POSITION[1].x + distance + (Math.random() * distance) / 2,
      y: BALL_POSITION[1].y + distance + (Math.random() * distance) / 2,
      z: BALL_POSITION[1].z + distance + (Math.random() * distance) / 2,
    },
    {
      x: BALL_POSITION[1].x + Math.random() * distance,
      y: BALL_POSITION[1].y - Math.random() * distance,
      z: BALL_POSITION[1].z + Math.random() * distance,
    },
  ];
  for (let i in otherBallsPosition) {
    let position = otherBallsPosition[i];
    new TWEEN.Tween(position)
      .to(ballsDestination[i], 1500)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(() => {
        otherBalls[i].position.copy(position);
      })
      .start();
  }
}

// start tween animation
function initTween(type, result, count) {
  setTimeout(() => {
    addBall(type, count, 10);
    ballTween(type, result);
    ballsTween();
  }, 200);
}

// hide wish buttons
function hideWishButtons() {
  document.querySelector(".wish-buttons-wrapper").style.display = "none";
}

// show wish buttons
function showWishButtons() {
  document.querySelector(".wish-buttons-wrapper").style.display = "block";
}

// clear scene
function clearScene() {
  camera.position.set(0, 0, -250);
  ballPosition = Object.assign({}, BALL_POSITION[0]);
  controls.target.copy(ballPosition);
  scene.clear();
  otherBalls.length = 0;
  otherBallsPosition.length = 0;
}

// show wish result
function showResult(result) {
  let dom = document.querySelector(".wish-result");
  let image = dom.children[0];
  let images = dom.children[1];
  if (result.length == 1) {
    images.style.display = "none";
    image.style.display = "block";
    image.classList.add(
      "fadeIn",
      "wish-result-image",
      result[0],
      Rule.getResultType(result[0])
    );
    setTimeout(() => {
      image.classList.add("opacity100");
      dom.onclick = function () {
        image.classList.remove(
          "fadeIn",
          "opacity100",
          "wish-result-image",
          result[0],
          Rule.getResultType(result[0])
        );
        hideResult();
        clearScene();
        showWishButtons();
      };
    }, 1500);
  } else {
    image.style.display = "none";
    images.style.display = "flex";
    for (let r of result) {
      let img = document.createElement("div");
      img.classList.add(
        "wish-result-image",
        imageDirection,
        r,
        Rule.getResultType(r)
      );
      images.appendChild(img);
    }
    images.classList.add("fadeIn");
    setTimeout(() => {
      images.classList.add("opacity100");
      images.onclick = function () {
        images.classList.remove("fadeIn", "opacity100");
        for (let c of [...images.children]) {
          c.remove();
        }
        hideResult();
        clearScene();
        showWishButtons();
      };
    }, 1500);
  }
  dom.style.display = "block";
}

// hide wish result
function hideResult() {
  document.querySelector(".wish-result").style.display = "none";
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  render();
}

function render() {
  const delta = clock.getDelta();
  controls.update(delta);
  renderer.render(scene, camera);
}

window.wish = function (count) {
  hideWishButtons();
  let result = Rule.wish(count);
  initTween(Rule.getResultTypes(result), result, count);
};

window.addEventListener("resize", (ev) => {
  imageDirection = screen.width > screen.height ? "landscape" : "portrait";
  distance = screen.width;
  if (imageDirection == "landscape") {
    for (let c of document.querySelectorAll(".multiple-result .portrait")) {
      c.classList.remove("portrait");
      c.classList.add("landscape");
    }
  } else {
    for (let c of document.querySelectorAll(".multiple-result .landscape")) {
      c.classList.remove("landscape");
      c.classList.add("portrait");
    }
  }
});

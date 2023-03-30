import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
import starsTexture from '../orbit_images/stars.jpg';
import sunTexture from '../orbit_images/sun.jpg';
import mercuryTexture from '../orbit_images/mercury.jpg';
import venusTexture from '../orbit_images/venus.jpg';
import earthTexture from '../orbit_images/earth.jpg';
import marsTexture from '../orbit_images/mars.jpg';
import jupiterTexture from '../orbit_images/jupiter.jpg';
import saturnTexture from '../orbit_images/saturn.jpg';
import saturnRingTexture from '../orbit_images/saturn ring.png';
import uranusTexture from '../orbit_images/uranus.jpg';
import uranusRingTexture from '../orbit_images/uranus ring.png';
import neptuneTexture from '../orbit_images/neptune.jpg';
import plutoTexture from '../orbit_images/pluto.jpg';
import createPlanet from "../assets/createPlanet";

// camera and Orbit Control
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1,1000);
camera.position.set(-90, 140, 140);
scene.add(camera);
const canvas = document.querySelector(".webcanvas");
const control = new OrbitControls(camera, canvas);

// scene and canvas and renderer 
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

// objects
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);

//Helper
// const axesHelper = new THREE.AxesHelper(500);
// scene.add(axesHelper);
// const gridHelper = new THREE.GridHelper(500);
// scene.add(gridHelper);

// Solar System
const textureLoader = new THREE.TextureLoader();
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({map: textureLoader.load(sunTexture)});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

const mercury = createPlanet(3.2, mercuryTexture, 28);
scene.add(mercury.obj);
const venus = createPlanet(5.8, venusTexture, 44);
scene.add(venus.obj);
const earth = createPlanet(6, earthTexture, 62);
scene.add(earth.obj);
const mars = createPlanet(4, marsTexture, 78);
scene.add(mars.obj);
const jupyter = createPlanet(12, jupiterTexture, 100);
scene.add(jupyter.obj);
const saturn = createPlanet(10, saturnTexture, 138, {
    innerRadius: 10,
    outerRadius: 20,
    texture: saturnRingTexture
});
scene.add(saturn.obj);
const uranus = createPlanet(7, uranusTexture, 176, {
    innerRadius: 7,
    outerRadius: 12,
    texture: uranusRingTexture
});
scene.add(uranus.obj);
const neptune = createPlanet(7, neptuneTexture, 200);
scene.add(neptune.obj);
const pluto = createPlanet(2.8, plutoTexture, 216);
scene.add(pluto.obj);


// loop
const loop = () => {
    //Self-rotation
    sun.rotateY(0.004);
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupyter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);
    pluto.mesh.rotateY(0.008);

    //Around-sun-rotation
    mercury.obj.rotateY(0.04);
    venus.obj.rotateY(0.015);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupyter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);
    pluto.obj.rotateY(0.00007);

    control.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}
loop();

window.addEventListener("resize",() => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width /sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});




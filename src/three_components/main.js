import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const light = new THREE.PointLight(0xffffff, 1, 100)
light.intensity = 1.25;
light.position.set(0,10,10)
scene.add(light);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 1000);
camera.position.set(0,0,15);
scene.add(camera);

const canvas = document.querySelector(".webcanvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

import * as THREE from "three";
import { CubeTexture, TextureLoader } from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

import nebula from "../assets/nebula.jpg";

// import data entry
// npm install dat.gui
import * as dat from 'dat.gui';
const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 1,
}
gui.addColor(options, 'sphereColor').onChange(function (e){
    sphere.material.color.set(e);
});
gui.add(options, 'wireframe').onChange(function (e){
    sphere.material.wireframe = e;
})
gui.add(options, 'speed', 0,0.1);
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);
let step = 0;

// scene
const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// light
// const light = new THREE.PointLight(0xffffff, 1, 100)
// light.intensity = 1.25;
// light.position.set(0,10,10)
// scene.add(light);

// const ambient_light = new THREE.AmbientLight(0x333333);
// scene.add(ambient_light);

// const directional_light = new THREE.DirectionalLight(0xffffff, 0.8);
// directional_light.position.set(-30, 60, -30);
// directional_light.bottom = -30;
// directional_light.castShadow = true;
// scene.add(directional_light);
// const dLightHelper = new THREE.DirectionalLightHelper(directional_light);
// scene.add(dLightHelper);
// const dLightShadowHelper = new THREE.CameraHelper(directional_light.shadow.camera);
// scene.add(dLightShadowHelper);

const spotlight = new THREE.SpotLight(0xffffff);
spotlight.position.set(10,10,0);
spotlight.castShadow = true;
spotlight.angle = 0.24;
scene.add(spotlight);
const spotlight_helper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlight_helper);


// axesHelper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(50);
scene.add(gridHelper);

// camera
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 1000);
camera.position.set(0,30,30);
scene.add(camera);

// canvas and renderer
const canvas = document.querySelector(".webcanvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);

// orbitControl
const control = new OrbitControls(camera, canvas);

// Objects
const boxGeometry = new THREE.BoxGeometry()
// const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00fff00});
const boxMaterial = new THREE.MeshStandardMaterial({color: 0x00fff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial)
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30,30);
// const planeMaterial = new THREE.MeshBasicMaterial({
const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x += Math.PI /2;
plane.receiveShadow = true;
scene.add(plane);

const sphereGeometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color:'#00ffa3',
    roughness: 0.8,
    wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.position.set(0, 10, 10);
sphere.castShadow = true;
scene.add(sphere);

// Fog
// scene.fog = new THREE.Fog(0xFFFFFF, 0, 200);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// renderer.setClearColor(0xFFEA00);
const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(nebula);
// const cubeTextureLoader = new THREE.CubeTextureLoader();
// scene.background = cubeTextureLoader.load([nebula, nebula, // nebula is square image
//                                             nebula, nebula,
//                                             nebula, nebula,]);

// const box2Geometry = new THREE.BoxGeometry(4,4,4);
// const box2Material = new THREE.MeshBasicMaterial({
//     //color: 0x00FF00,
//     // map: textureLoader.load(nebula)
// });
// const box2MultiMaterial = [
//     new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)}),
//     new THREE.MeshBasicMaterial({map: textureLoader.load(nebula)})
// ];
// const box2 = new THREE.Mesh(box2Geometry, box2MultiMaterial);
// box2.position.set(0, 15, 10);
// scene.add(box2);

// Raycast
const mousePosition = new THREE.Vector2();
window.addEventListener('mousemove', function(e) {
    mousePosition.x = (e.clientX / window.innerWidth) *2 -1;
    mousePosition.y = (e.clientY / window.innerHeight)*2 +1;
});

const rayCaster = new THREE.Raycaster();
const sphereID = sphere.id;

// Loop
const loop = () => {
    box.rotation.x += 0.05;
    box.rotation.y += 0.05;

    step += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(step));

    spotlight.angle = options.angle;
    spotlight.penumbra = options.penumbra;
    spotlight.intensity = options.intensity;
    spotlight_helper.update();

    rayCaster.setFromCamera(mousePosition, camera);
    const intersects = rayCaster.intersectObjects(scene.children);
    for(let i=0; i< intersects.length; i++){
        if(intersects[i].object.id === sphereID)
            intersects[i].object.material.color.set(0XFF00000);    
    }

    control.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();
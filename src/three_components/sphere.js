import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const shape = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({
    color:'#00ffa3',
    roughness: 0.8,
});
const mesh = new THREE.Mesh(shape, material);
scene.add(mesh);

const light = new THREE.PointLight(0xffffff, 1, 100)
light.intensity = 1.25;
light.position.set(0,10,10);
scene.add(light);

const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 1000);
camera.position.set(0,0,15);
scene.add(camera);

const canvas = document.querySelector(".webcanvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

const control = new OrbitControls(camera, canvas);
control.enableDamping = true;
control.enablePan = false;
control.enableZoom = false;
control.autoRotate = true;
control.autoRotateSpeed = 5;

window.addEventListener("resize",() => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width /sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});

const loop = () => {
    control.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
};
loop();

const t1 = gsap.timeline({defaults: {duration: 1}})
t1.fromTo(mesh.scale, {z:0, x:0, y:0}, {z:1, x:1, y:1})

let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => {mouseDown=true})
window.addEventListener("mouseup", () => {mouseDown=false})

window.addEventListener('mousemove', (e) => {
    if(mouseDown) {
        rgb = [ Math.round((e.pageX/ sizes.width) * 255),
                Math.round((e.pageY/ sizes.height) * 255),
                155]
        rgb = new THREE.Color(`rgb(${rgb.join(",")})`);
        gsap.to(mesh.material.color, {r: rgb.r, g:rgb.g, b: rgb.b});
    }
})
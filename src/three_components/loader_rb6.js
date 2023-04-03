import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
const FILEPATH = 'rb6_source/rb6.glb';

import * as dat from 'dat.gui';
const gui = new dat.GUI();


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.rotation.y = 45/180*Math.PI;
camera.position.x = 40;
camera.position.y = 0;
camera.position.z = 50;

const canvas = document.querySelector(".webcanvas");
const renderer = new THREE.WebGLRenderer({canvas});
// renderer.setAntiAlias(true);
renderer.setSize(window.innerWidth,window.innerHeight);

const light2 = new THREE.PointLight(0xc4c4c4,10);
light2.position.set(500,100,0);
scene.add(light2);

const light4 = new THREE.PointLight(0xc4c4c4,10);
light4.position.set(-500,300,500);
scene.add(light4);

// import RB6
const assetLoader = new GLTFLoader();
let mixer;
assetLoader.load(FILEPATH, function ( gltf ) {
    const model = gltf.scene.children[0];
    // model = new THREE.Mesh(model, materials);
    mixer = new THREE.AnimationMixer( model );

    const animations = gltf.animations;
    animations.forEach( function (clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

    const skeleton = new THREE.SkeletonHelper( model );
    skeleton.visible = false;
    scene.add( skeleton );
    scene.add(model);
} );

let control = new OrbitControls(camera, canvas);
const clock = new THREE.Clock();
const loop = () => {
    if(mixer)
        mixer.update(clock.getDelta());
    control.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();

// var textureFiles = ["rb6_textures/Body21_diff.png",
//                     "rb6_textures/Chassis1_diff.png", 
//                     "rb6_textures/Meshpart1_diff.png",
//                     "rb6_textures/Meshpart3_diff.png",
//                     "rb6_textures/Meshpart4_diff.png",];
// // Create an array to hold the loaded textures
// var textures = [];
// // Load the textures
// for (var i = 0; i < textureFiles.length; i++) {
//   textures[i] = new THREE.TextureLoader().load(textureFiles[i]);
// }
// // Create an array of materials using the loaded textures
// var materials = [];
// for (var i = 0; i < textures.length; i++) {
//   materials[i] = new THREE.MeshStandardMaterial({ map: textures[i] });
// }

import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
//import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
const FILEPATH = 'MERCEDES_AMG_GT.glb';
let idleAction, runAction, standAction, walkAction;

import * as dat from 'dat.gui';
const gui = new dat.GUI();
const options = {
    angle: 0.2,
    penumbra: 0.5,
    intensity: 1.0,
    walk: 1.0,
    run: 0.0,
}
gui.add(options, 'angle', 0, 1);
gui.add(options, 'penumbra', 0, 1);
gui.add(options, 'intensity', 0, 1);
// gui.add(options, 'walk', 0,  1.0, 0.01 ).listen().onChange(function(e){setWeight(walkAction, e);});
// gui.add(options, 'run', 0.0, 1.0, 0.01 ).listen().onChange(function(e){setWeight(runAction, e);});

const scene = new THREE.Scene();
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// light
const spotlight = new THREE.SpotLight(0xffffff);
spotlight.position.set(20,20,0);
spotlight.castShadow = true;
spotlight.angle = 0.3;
scene.add(spotlight);

const spotlight_helper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlight_helper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
const gridHelper = new THREE.GridHelper(50);
scene.add(gridHelper);
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set( 1, 2, - 3 );
const canvas = document.querySelector(".webcanvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
renderer.setClearColor(0x111111);
// scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );

// orbitControl
const control = new OrbitControls(camera, canvas);

// import solider asset
// const assetLoader = new GLTFLoader();
// let mixer;
// assetLoader.load('Soldier.glb', function ( gltf ) {
    // gltf.scene.traverse( function ( object ) {
    //     if ( object.isMesh ) object.castShadow = true;
    // });
//     const model = SkeletonUtils.clone( gltf.scene );
//     mixer = new THREE.AnimationMixer( model );

//     const animations = gltf.animations;
//     idleAction = mixer.clipAction( animations[ 0 ] );
//     runAction  = mixer.clipAction( animations[ 1 ] );
//     standAction = mixer.clipAction( animations[ 2 ] );
//     walkAction = mixer.clipAction( animations[ 3 ] );

//     const actions = [ idleAction, walkAction, standAction, runAction,];
//     setWeight( idleAction, 0.0 );
//     setWeight( walkAction, options.walk );
//     setWeight( standAction, 0.0 );
//     setWeight( runAction, options.run );
//     actions.forEach( function ( action ) { action.play(); });

//     const skeleton = new THREE.SkeletonHelper( model );
//     skeleton.visible = false;
//     scene.add( skeleton );
//     scene.add(model);
// } );

// function setWeight( action, weight ) {
//     action.enabled = true;
//     action.setEffectiveTimeScale( 1 );
//     action.setEffectiveWeight( weight );
// }

// import car
const assetLoader = new GLTFLoader();
let mixer;
assetLoader.load(FILEPATH, function ( gltf ) {
    gltf.scene.traverse( function ( object ) {
        if ( object.isMesh ) {
            object.castShadow = true;
        }
    });
    const model = SkeletonUtils.clone( gltf.scene );
    mixer = new THREE.AnimationMixer( model );

    const animations = gltf.animations;
    //console.log(animations.length);
    animations.forEach( function (clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });

    const skeleton = new THREE.SkeletonHelper( model );
    skeleton.visible = false;
    scene.add( skeleton );
    scene.add(model);
} );

const planeGemometry = new THREE.PlaneGeometry(15, 15);
const planeMaterial  = new THREE.MeshStandardMaterial({color: 0xC6C6C6, side: THREE.DoubleSide});
const plane = new THREE.Mesh(planeGemometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// Loop
const clock = new THREE.Clock();
const loop = () => {
    spotlight.angle = options.angle;
    spotlight.penumbra = options.penumbra;
    spotlight.intensity = options.intensity;
    spotlight_helper.update();

    if(mixer)
        mixer.update(clock.getDelta());

    control.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(loop);
}

loop();
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SoldierFactory } from "./SoldierFactory.js";
import { AnimationLoader } from "./AnimationLoader.js";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const loader = new AnimationLoader();
const soldierFactory = new SoldierFactory(loader);
const soldier = soldierFactory.createEntity();
soldier.setPosition(0, 0, 0);
scene.add(soldier.object3D);
scene.add(soldier.collisionComponent.collisionBoxHelper);
const clock = new THREE.Clock();
const controls = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    controls.update();
    soldier.update(delta);
    renderer.render(scene, camera);
}
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);
animate();

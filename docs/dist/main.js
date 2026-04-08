// main.ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { SceneSystem } from "./SceneSystem.js";
import { SoldierFactory } from "./SoldierFactory.js";
import { SlimeFactory } from "./SlimeFactory.js";
import { AnimationLoader } from "./AnimationLoader.js";
import { Block } from "./Block.js";
import { HealthBarSystem } from "./HealthBarSystem.js";
import { CollisionSystem } from "./CollisionSystem.js";
import { InputSystem } from "./InputSystem.js";
import { SoldierMovementSystem } from "./SoldierMovementSystem.js";
import { SoldierAnimationSystem } from "./SoldierAnimationSystem.js";
import { SoldierAttackingSystem } from "./SoldierAttackingSystem.js";
import { SlimeAnimationSystem } from "./SlimeAnimationSystem.js";
import { SlimeMovementSystem } from "./SlimeMovementSystem.js";
import { SlimeAttackingSystem } from "./SlimeAttackingSystem.js";
import { AnimationFrameSystem } from "./SpriteAnimationSystem.js";
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const sceneSystem = new SceneSystem({ renderer });
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
sceneSystem.addCamera(camera, true);
const controls = new OrbitControls(camera, renderer.domElement);
const loader = new AnimationLoader();
const soldierFactory = new SoldierFactory(loader);
const slimeFactory = new SlimeFactory(loader);
const soldier = soldierFactory.createEntity();
sceneSystem.addGameObject(soldier);
const slime = slimeFactory.createEntity();
sceneSystem.addGameObject(slime);
const block = new Block(20, 20, 0.2);
sceneSystem.addGameObject(block);
const inputSystem = new InputSystem();
const healthBarSystem = new HealthBarSystem([soldier, slime]);
// const animationSystem = new SpriteAnimationSystem([soldier, slime]);
const animationFrameSystem = new AnimationFrameSystem([soldier, slime]);
const collisionSystem = new CollisionSystem([soldier, slime, block]);
const soldierMovementSystem = new SoldierMovementSystem(soldier.getComponent("movement"), soldier.getComponent("gravity"), inputSystem);
const slimeMovementSystem = new SlimeMovementSystem(slime.getComponent("movement"), soldier);
const soldierAnimationSystem = new SoldierAnimationSystem(soldier);
const soldierAttackingSystem = new SoldierAttackingSystem(inputSystem, soldier.getComponent("attack"));
const slimeAnimationSystem = new SlimeAnimationSystem(slime);
const slimeAttackingSystem = new SlimeAttackingSystem(slime.getComponent("attack"), slime.getComponent("attackRange"), soldier);
// ----------------------------
// Updatable systems array
// ----------------------------
// Order is important:
// 1) Movement system sets velocities based on input
// 2) Scene system updates all entities/components and applies movement
// 3) Collision system corrects invalid positions (ground, walls)
// 4) Visual-only systems (health bar, animation)
const updatableSystems = [
    soldierMovementSystem,
    soldierAttackingSystem,
    slimeMovementSystem,
    slimeAttackingSystem,
    sceneSystem,
    collisionSystem,
    healthBarSystem,
    soldierAnimationSystem,
    slimeAnimationSystem,
    animationFrameSystem
    //animationSystem,    
];
const eventDrivenSystems = [
    inputSystem
];
const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    controls.update();
    updatableSystems.forEach(system => system.update(delta));
    sceneSystem.render();
}
animate();

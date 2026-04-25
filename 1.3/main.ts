// main.ts
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { SceneSystem } from "./SceneSystem.js";
import { SoldierFactory } from "./SoldierFactory.js";
import { SlimeFactory } from "./SlimeFactory.js";
import { AnimationLoader } from "./AnimationLoader.js";
import { Block } from "./Block.js";
import { Entity } from "./Entity.js";
import type { IEntityFactory } from "./IEntityFactory.js";
import { Soldier } from "./Soldier.js";
import { Slime } from "./Slime.js";

import type { IUpdatableSystem } from "./IUpdatableSystem.js";
import { HealthBarSystem } from "./HealthBarSystem.js";
import { CollisionSystem } from "./CollisionSystem.js";
import { InputSystem } from "./InputSystem.js";
import { SoldierMovementSystem } from "./SoldierMovementSystem.js";
import type { IEventDrivenSystem } from "./IEventDrivenSystem.js";
import { SoldierAnimationSystem } from "./SoldierAnimationSystem.js";
import { SoldierAttackingSystem } from "./SoldierAttackingSystem.js";
import { SlimeAnimationSystem } from "./SlimeAnimationSystem.js";
import { SlimeMovementSystem } from "./SlimeMovementSystem.js";
import { SlimeAttackingSystem } from "./SlimeAttackingSystem.js";
import { AnimationFrameSystem } from "./SpriteAnimationSystem.js";
import { HealthPackFactory } from "./HealthPackFactory.js";
import { HealthPack } from "./HealthPack.js";
import { HealthPackPickupSystem } from "./HealthPackPickupSystem.js";
import { EventObserver } from "./EventObserver.js";
import { SoundManager } from "./SoundManager.js";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GameMapLoader } from "./GameMapLoader.js";
import { GameMap } from "./GameMap.js";
import { MapEntity } from "./MapEntity.js";
import { CollisionComponent } from "./CollisionComponent.js";


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const soundManager = SoundManager.getInstance();
soundManager.loadSound("jump", "SoundEffects/jump.wav");
soundManager.loadSound("power_up", "SoundEffects/power_up.wav");
soundManager.loadSound("hurt", "SoundEffects/hurt.wav");
soundManager.loadSound("explosion", "SoundEffects/explosion.wav");
soundManager.loadSound("coin", "SoundEffects/coin.wav");
soundManager.loadSound("tap", "SoundEffects/tap.wav");

// Initialize audio on first click to satisfy browser requirements
window.addEventListener("click", () => soundManager.init(), { once: true });

const sceneSystem = new SceneSystem({ renderer });
const eventObserver = new EventObserver();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 10);
sceneSystem.addCamera(camera, true);


const controls = new OrbitControls(camera, renderer.domElement);


const loader = new AnimationLoader();

const soldierFactory: IEntityFactory = new SoldierFactory(loader);
const slimeFactory: IEntityFactory = new SlimeFactory(loader);
const healthPackFactory: IEntityFactory = new HealthPackFactory(loader);

const soldier: Soldier = soldierFactory.createEntity(eventObserver) as Soldier;
sceneSystem.addGameObject(soldier);
soldier.setPosition(0, 20, 0); // Spawn high to test falling

const slime: Slime = slimeFactory.createEntity(eventObserver) as Slime;
sceneSystem.addGameObject(slime);
slime.setPosition(3, 20, 0); // Spawn high to test falling

const timer: number = window.setTimeout(() => {
  console.log("Done");
}, 30000);

const healthPack: HealthPack = healthPackFactory.createEntity(eventObserver) as HealthPack;
sceneSystem.addGameObject(healthPack);
healthPack.setPosition(-3, 20, 0); // Spawn high to test falling


const block = new Block(100, 100, 0.2);
sceneSystem.addGameObject(block);
block.setPosition(0,-2.7,0)


const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);

sceneSystem.addLight(dirLight);

const inputSystem = new InputSystem();


const healthBarSystem = new HealthBarSystem([soldier, slime]);
// const animationSystem = new SpriteAnimationSystem([soldier, slime]);
const animationFrameSystem = new AnimationFrameSystem([soldier, slime]);
const healthPackPickupSystem = new HealthPackPickupSystem(sceneSystem.gameObjects as Entity[], eventObserver);
// Collision system - will be updated after map loads
let collisionSystem = new CollisionSystem([soldier, slime, block, healthPack]);
const soldierMovementSystem = new SoldierMovementSystem(
  soldier.getComponent("movement"),
  soldier.getComponent("gravity"),
  inputSystem,
  eventObserver
);
const slimeMovementSystem = new SlimeMovementSystem(
  slime.getComponent("movement"),
  soldier,
  slime
);

const soldierAnimationSystem = new SoldierAnimationSystem(soldier);
const soldierAttackingSystem = new SoldierAttackingSystem(inputSystem, soldier, [slime]);
const slimeAnimationSystem = new SlimeAnimationSystem(slime);
const slimeAttackingSystem = new SlimeAttackingSystem(slime.getComponent("attack")!, slime.getComponent("attackRange")!, soldier, slime);
// ----------------------------
// Updatable systems array
// ----------------------------
// Order is important:
// 1) Movement system sets velocities based on input
// 2) Scene system updates all entities/components and applies movement
// 3) Collision system corrects invalid positions (ground, walls)
// 4) Visual-only systems (health bar, animation)

const updatableSystems: IUpdatableSystem[] = [
    soldierMovementSystem,
    soldierAttackingSystem,
    slimeMovementSystem,
    slimeAttackingSystem,   
    sceneSystem,
    healthPackPickupSystem,
    healthBarSystem,
    animationFrameSystem,
    soldierAnimationSystem,
    slimeAnimationSystem
];

// Collision system is added separately since it's rebuilt after map loads

const eventDrivenSystems: IEventDrivenSystem[] = [
  inputSystem
];



const gameMapLoader = new GameMapLoader(new GLTFLoader());
const gameMap = new GameMap(gameMapLoader);
gameMap.getInstance((model, gameObjects) => {
  model.scale.setScalar(0.01);
  model.updateMatrixWorld(true);

  sceneSystem.scene.add(model);

  const torchRoots = new Map<string, THREE.Object3D>();
  for (const obj of gameObjects) {
    if (!obj.object3D.name.toLowerCase().includes("torch")) continue;

    let root = obj.object3D;
    while (root.parent && root.parent.name.toLowerCase().includes("torch")) {
      root = root.parent;
    }

    torchRoots.set(root.uuid, root);
  }

  const mapBounds = new THREE.Box3().setFromObject(model);
  const mapCenter = mapBounds.getCenter(new THREE.Vector3());

  camera.position.set(10, 5, 0);
  controls.target.copy(mapCenter);
  camera.lookAt(mapCenter);
  controls.update();

  for (const torchRoot of torchRoots.values()) {
    torchRoot.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(torchRoot);
    if (bounds.isEmpty()) continue;

    const height = Math.max(bounds.max.y - bounds.min.y, 0.001);
    const worldAttachPoint = new THREE.Vector3(
      (bounds.min.x + bounds.max.x) * 0.5,
      bounds.max.y - height * 0.2,
      (bounds.min.z + bounds.max.z) * 0.5
    );
    const localAttachPoint = torchRoot.worldToLocal(worldAttachPoint.clone());

    const light = new THREE.PointLight(0xff8800, 3.5, 12);
    light.position.copy(localAttachPoint);
    torchRoot.add(light);

    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0xffcc88,
        emissive: 0xff7a2f,
        emissiveIntensity: 2.8,
        transparent: true,
        opacity: 0.95
      })
    );

    glow.position.copy(localAttachPoint);
    torchRoot.add(glow);
  }

  const allEntities = [
    soldier,
    slime,
    block,
    healthPack,
    ...gameObjects.filter(obj => obj.object3D.name.toLowerCase() !== "grass")
  ] as any;

  collisionSystem = new CollisionSystem(allEntities);

  for (const obj of gameObjects) {
    sceneSystem.addGameObject(obj);

    const isGrass = obj.object3D.name.toLowerCase() === "grass";


    if (obj.collisionComponent && !isGrass) {
      obj.collisionComponent.enableDebug(sceneSystem.scene);
    }
  }
});
const clock = new THREE.Clock();



function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  controls.update();
  updatableSystems.forEach(system => system.update(delta));
  collisionSystem.update(delta); // Update collision system separately

  sceneSystem.render();
}

animate();
 
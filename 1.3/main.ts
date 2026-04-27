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
import { MovementComponent } from "./MovementComponent.js";
import { AttackingComponent } from "./AttackingComponent.js";
import { AttackRangeComponent } from "./AttackRangeComponent.js";
import { HealthComponent } from "./HealthComponent.js";


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const slimeKillCounter = document.createElement("div");
slimeKillCounter.style.position = "fixed";
slimeKillCounter.style.top = "16px";
slimeKillCounter.style.left = "16px";
slimeKillCounter.style.padding = "8px 12px";
slimeKillCounter.style.background = "rgba(0, 0, 0, 0.65)";
slimeKillCounter.style.color = "#f2f2f2";
slimeKillCounter.style.fontFamily = "monospace";
slimeKillCounter.style.fontSize = "16px";
slimeKillCounter.style.border = "1px solid rgba(255, 255, 255, 0.3)";
slimeKillCounter.style.borderRadius = "6px";
slimeKillCounter.style.zIndex = "1000";
slimeKillCounter.textContent = "Slimes Killed: 0";
document.body.appendChild(slimeKillCounter);

const gameOverOverlay = document.createElement("div");
gameOverOverlay.style.position = "fixed";
gameOverOverlay.style.inset = "0";
gameOverOverlay.style.display = "none";
gameOverOverlay.style.alignItems = "center";
gameOverOverlay.style.justifyContent = "center";
gameOverOverlay.style.background = "rgba(0, 0, 0, 0.75)";
gameOverOverlay.style.color = "#ffffff";
gameOverOverlay.style.fontFamily = "monospace";
gameOverOverlay.style.fontSize = "48px";
gameOverOverlay.style.fontWeight = "700";
gameOverOverlay.style.letterSpacing = "2px";
gameOverOverlay.style.zIndex = "2000";
gameOverOverlay.textContent = "GAME OVER";
document.body.appendChild(gameOverOverlay);

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
const slimeSpawnPoint = new THREE.Vector3(0, 4, 0);
const healthPackSpawnPoint = new THREE.Vector3(-3, 4, 0);
const SLIME_SPAWN_INTERVAL_MS = 15000;
const HEALTHPACK_SPAWN_INTERVAL_MS = 60000;

const soldierFactory: IEntityFactory = new SoldierFactory(loader);
const slimeFactory: IEntityFactory = new SlimeFactory(loader);
const healthPackFactory: IEntityFactory = new HealthPackFactory(loader);

const soldier: Soldier = soldierFactory.createEntity(eventObserver) as Soldier;
sceneSystem.addGameObject(soldier);
soldier.setPosition(0, 4, 0);

const slime: Slime = slimeFactory.createEntity(eventObserver) as Slime;
sceneSystem.addGameObject(slime);
slime.setPosition(slimeSpawnPoint.x, slimeSpawnPoint.y, slimeSpawnPoint.z);

const healthPack: HealthPack = healthPackFactory.createEntity(eventObserver) as HealthPack;
sceneSystem.addGameObject(healthPack);
healthPack.setPosition(healthPackSpawnPoint.x, healthPackSpawnPoint.y, healthPackSpawnPoint.z);


const block = new Block(100, 100, 0.2);
sceneSystem.addGameObject(block);
block.setPosition(0,-2.7,0)


const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);

sceneSystem.addLight(dirLight);

const inputSystem = new InputSystem();


const enemies: Entity[] = [slime];
const animationEntities: Entity[] = [soldier, slime];
const healthBarEntities: Entity[] = [soldier, slime];
const collisionEntities: Entity[] = [soldier, slime, block];
const slimeSystems: IUpdatableSystem[] = [];
let isMapReady = false;
let isGameOver = false;
let slimeKillCount = 0;
const countedSlimeDeaths = new Set<Entity>();
let slimeSpawnIntervalId = 0;
let healthPackSpawnIntervalId = 0;

function updateSlimeKillCounter(): void {
  slimeKillCounter.textContent = `Slimes Killed: ${slimeKillCount}`;
}

function triggerGameOver(): void {
  if (isGameOver) return;

  isGameOver = true;
  gameOverOverlay.style.display = "flex";
  window.clearInterval(slimeSpawnIntervalId);
  window.clearInterval(healthPackSpawnIntervalId);
}

function registerSlime(newSlime: Slime): void {
  enemies.push(newSlime);
  animationEntities.push(newSlime);
  healthBarEntities.push(newSlime);
  collisionEntities.push(newSlime);

  const movement = newSlime.getComponent<MovementComponent>("movement");
  const attack = newSlime.getComponent<AttackingComponent>("attack");
  const attackRange = newSlime.getComponent<AttackRangeComponent>("attackRange");

  if (!movement || !attack || !attackRange) {
    console.warn("Spawned slime is missing required components.");
    return;
  }

  slimeSystems.push(new SlimeMovementSystem(movement, soldier, newSlime));
  slimeSystems.push(new SlimeAttackingSystem(attack, attackRange, soldier, newSlime));
  slimeSystems.push(new SlimeAnimationSystem(newSlime));
}

registerSlime(slime);

function registerHealthPack(newHealthPack: HealthPack): void {
  animationEntities.push(newHealthPack);
  collisionEntities.push(newHealthPack);
}

function hasActiveHealthPack(): boolean {
  for (const gameObject of sceneSystem.gameObjects) {
    if (!(gameObject instanceof HealthPack)) continue;

    const health = gameObject.getComponent<HealthComponent>("health");
    if (!health?.isDead) {
      return true;
    }
  }

  return false;
}

registerHealthPack(healthPack);

const healthBarSystem = new HealthBarSystem(healthBarEntities);
const animationFrameSystem = new AnimationFrameSystem(animationEntities);
const healthPackPickupSystem = new HealthPackPickupSystem(sceneSystem.gameObjects as Entity[], eventObserver);
// Collision system - will be updated after map loads
let collisionSystem = new CollisionSystem(collisionEntities);
const soldierMovementSystem = new SoldierMovementSystem(
  soldier.getComponent("movement"),
  soldier.getComponent("gravity"),
  inputSystem,
  eventObserver
);

const soldierAnimationSystem = new SoldierAnimationSystem(soldier);
const soldierAttackingSystem = new SoldierAttackingSystem(inputSystem, soldier, enemies);
const gameOverSystem: IUpdatableSystem = {
  update(): void {
    const health = soldier.getComponent<HealthComponent>("health");
    if (health?.isDead) {
      triggerGameOver();
    }
  }
};
const slimeKillTrackerSystem: IUpdatableSystem = {
  update(): void {
    for (const enemy of enemies) {
      if (countedSlimeDeaths.has(enemy)) continue;

      const health = enemy.getComponent<HealthComponent>("health");
      if (!health?.isDead) continue;

      countedSlimeDeaths.add(enemy);
      slimeKillCount += 1;
      updateSlimeKillCounter();
    }
  }
};
const dynamicSlimeSystems: IUpdatableSystem = {
  update(delta: number): void {
    for (const slimeSystem of slimeSystems) {
      slimeSystem.update(delta);
    }
  }
};
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
  gameOverSystem,
  slimeKillTrackerSystem,
  dynamicSlimeSystems,
    sceneSystem,
    healthPackPickupSystem,
    healthBarSystem,
    animationFrameSystem,
    soldierAnimationSystem,
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


  camera.position.set(0, 3, 3.9);
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
    ...gameObjects.filter(obj => obj.object3D.name.toLowerCase() !== "grass")
  ] as Entity[];

  collisionEntities.push(...allEntities);
  collisionSystem = new CollisionSystem(collisionEntities);

  for (const obj of gameObjects) {
    sceneSystem.addGameObject(obj);

    const isGrass = obj.object3D.name.toLowerCase() === "grass";


    if (obj.collisionComponent && !isGrass) {
      obj.collisionComponent.enableDebug(sceneSystem.scene);
    }
  }

  isMapReady = true;
});

slimeSpawnIntervalId = window.setInterval(() => {
  if (!isMapReady) return;

  const spawnedSlime = slimeFactory.createEntity(eventObserver) as Slime;
  sceneSystem.addGameObject(spawnedSlime);

  spawnedSlime.setPosition(slimeSpawnPoint.x, slimeSpawnPoint.y, slimeSpawnPoint.z);

  registerSlime(spawnedSlime);
}, SLIME_SPAWN_INTERVAL_MS);

healthPackSpawnIntervalId = window.setInterval(() => {
  if (!isMapReady || hasActiveHealthPack()) return;

  const spawnedHealthPack = healthPackFactory.createEntity(eventObserver) as HealthPack;
  sceneSystem.addGameObject(spawnedHealthPack);
  spawnedHealthPack.setPosition(
    healthPackSpawnPoint.x,
    healthPackSpawnPoint.y,
    healthPackSpawnPoint.z
  );

  registerHealthPack(spawnedHealthPack);
}, HEALTHPACK_SPAWN_INTERVAL_MS);

const clock = new THREE.Clock();
const MAX_SIMULATION_STEP = 1 / 60;
const MAX_ACCUMULATED_DELTA = 0.1;



function animate() {
  requestAnimationFrame(animate);
  const frameDelta = Math.min(clock.getDelta(), MAX_ACCUMULATED_DELTA);
  controls.update();

  if (!isMapReady) {
    sceneSystem.render();
    return;
  }

  if (isGameOver) {
    sceneSystem.render();
    return;
  }

  let remaining = frameDelta;
  while (remaining > 0) {
    const delta = Math.min(remaining, MAX_SIMULATION_STEP);
    updatableSystems.forEach(system => system.update(delta));
    collisionSystem.update(delta); // Update collision system separately
    remaining -= delta;
  }

  sceneSystem.render();
}

animate();
 
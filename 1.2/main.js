import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Player } from "./Player.js";
import { Slime } from "./Slime.js";
import { StaticObject } from "./StaticObject.js"
import { HealthBar } from "./HealthBar.js"
"use strict";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const playerAnimations = {
  idle: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Idle-Sheet.png",
  walk: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Walk-Sheet.png",
  attack1: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Attack1-Sheet.png",
  attack2: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Attack2-Sheet.png",
  death: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Death-Sheet.png",
  block: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Block-Sheet.png",
  jump: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Jump_Fall-Sheet.png"
};

const slimeAnimations = {
  idle: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Idle-Sheet.png",
  walk: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Walk-Sheet.png",
  attack1: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Attack1-Sheet.png",
  attack2: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Attack2-Sheet.png",
  jump: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Jump_Fall-Sheet.png",
  death: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Death-Sheet.png"
};

const slime = new Slime(slimeAnimations, 0.4, scene);
slime.sprite.position.x = 1;

const player = new Player(playerAnimations, 1, scene);





const keys = {};



document.addEventListener("keydown",(ev)=>{
  keys[ev.key] = true;
  if (ev.key=="f") player.attack();
})

document.addEventListener("keyup",(ev)=>{
  keys[ev.key] = false;
})


const ambientLight = new THREE.AmbientLight(0xffffff, 50);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 50);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

const plane = new THREE.Mesh(new THREE.PlaneGeometry(6,6),new THREE.MeshStandardMaterial({color:0xffffff}));
plane.rotation.x = -Math.PI / 2
plane.position.y = -0.5
scene.add(plane);
const controls = new OrbitControls(camera,renderer.domElement);
const clock = new THREE.Clock();

document.addEventListener("keydown",(ev)=>{
  if (ev.key==="b"){
    console.log("HE DEAD")
    player.die()
  }
  if (ev.key === "h"){
    player.healthBar.setHealth(0.25);
  }
})


function animate(){
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  player.handleMovement(keys,delta);
  player.updatePhysics(delta);
  player.update(delta);
  slime.lookForPlayer(delta,player);
  player.healthBar.updatePosition(camera);
  slime.healthBar.updatePosition(camera);
  slime.update(delta);
  controls.update()
  renderer.render(scene,camera);
}

animate();
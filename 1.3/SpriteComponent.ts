import * as THREE from "three";
import { SpriteAnimator } from "./SpriteAnimator.js";
import { SpriteAnimationManager } from "./SpriteAnimationManager.js";

export class SpriteComponent {
  sprite: THREE.Sprite;
  animationManager: SpriteAnimationManager;

  constructor(material: THREE.SpriteMaterial) {
    this.sprite = new THREE.Sprite(material);
    this.animationManager = new SpriteAnimationManager(this.sprite);
  }

  addAnimation(name: string, animator: SpriteAnimator): void {
    this.animationManager.addAnimation(name, animator);
  }

  playAnimation(name: string): void {
    this.animationManager.play(name);
  }

  update(delta: number): void {
    this.animationManager.update(delta);
  }
}
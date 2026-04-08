import * as THREE from "three";
import { SpriteAnimator } from "./SpriteAnimator.js";
import { SpriteAnimationManager } from "./SpriteAnimationManager.js";
import { IUpdatableComponent } from "./IUpdatableComponent.js";

export class SpriteComponent implements IUpdatableComponent{


  sprite: THREE.Sprite;
  animationManager: SpriteAnimationManager;
  container : THREE.Object3D;

  constructor(material: THREE.SpriteMaterial) {
    this.sprite = new THREE.Sprite(material);
    this.animationManager = new SpriteAnimationManager(this.sprite);
    this.container = new THREE.Object3D();
    // Use the container to hold the sprite so we can apply flips/offsets
    this.container.add(this.sprite);
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

  setFlipX(flip: boolean) {
      if (!this.sprite.material.map) return;

      this.sprite.material.map.repeat.x = Math.abs(this.sprite.material.map.repeat.x) * (flip ? -1 : 1);
      this.sprite.material.map.needsUpdate = true;
  }
}
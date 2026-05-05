// SpriteAnimationManager.ts
import * as THREE from "three";
import { SpriteAnimator } from "./SpriteAnimator.js";

export class SpriteAnimationManager {
  sprite: THREE.Sprite;
  animations: Record<string, SpriteAnimator>;
  currentAnimation: SpriteAnimator | null;

  constructor(sprite: THREE.Sprite) {
    this.sprite = sprite;
    this.animations = {}; 
    this.currentAnimation = null;
  }

  addAnimation(name: string, animator: SpriteAnimator): void {
    this.animations[name] = animator;

    if (!this.currentAnimation) {
      this.currentAnimation = animator;
      this.sprite.material.map = animator.texture;
      this.sprite.material.needsUpdate = true;
    }
  }

  play(name: string): void {
    const animator = this.animations[name];
    if (animator && this.currentAnimation !== animator) {
      this.currentAnimation = animator;
      this.currentAnimation.reset();
      this.sprite.material.map = this.currentAnimation.texture;
      this.sprite.material.needsUpdate = true;
    }
  }

  update(delta: number): void {
    if (this.currentAnimation) {
      this.currentAnimation.update(delta);
    }
  }
}
import * as THREE from "three";
"use strict";
export class SpriteAnimationManager {
  constructor(sprite) {
    this.sprite = sprite;
    this.animations = {}; 
    this.currentAnimation = null;
  }

  addAnimation(name, animator) {
    this.animations[name] = animator;

    if (!this.currentAnimation) {
      this.currentAnimation = animator;
      this.sprite.material.map = animator.texture;
      this.sprite.material.needsUpdate = true;
    }
  }

  play(name) {
    if (this.animations[name] && this.currentAnimation !== this.animations[name]) {
      this.currentAnimation = this.animations[name];
      this.currentAnimation.reset();
      this.sprite.material.map = this.currentAnimation.texture;
      this.sprite.material.needsUpdate = true;
    }
  }

  update(delta) {
    if (this.currentAnimation) {
      this.currentAnimation.update(delta);
    }
  }
}
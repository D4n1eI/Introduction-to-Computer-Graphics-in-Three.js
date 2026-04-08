import * as THREE from "three";
import { SpriteAnimationManager } from "./SpriteAnimationManager.js";
export class SpriteComponent {
    sprite;
    animationManager;
    container;
    constructor(material) {
        this.sprite = new THREE.Sprite(material);
        this.animationManager = new SpriteAnimationManager(this.sprite);
        this.container = new THREE.Object3D();
        // Use the container to hold the sprite so we can apply flips/offsets
        this.container.add(this.sprite);
    }
    addAnimation(name, animator) {
        this.animationManager.addAnimation(name, animator);
    }
    playAnimation(name) {
        this.animationManager.play(name);
    }
    update(delta) {
        this.animationManager.update(delta);
    }
    setFlipX(flip) {
        if (!this.sprite.material.map)
            return;
        this.sprite.material.map.repeat.x = Math.abs(this.sprite.material.map.repeat.x) * (flip ? -1 : 1);
        this.sprite.material.map.needsUpdate = true;
    }
}

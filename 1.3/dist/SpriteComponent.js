import * as THREE from "three";
import { SpriteAnimationManager } from "./SpriteAnimationManager.js";
export class SpriteComponent {
    sprite;
    animationManager;
    constructor(material) {
        this.sprite = new THREE.Sprite(material);
        this.animationManager = new SpriteAnimationManager(this.sprite);
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
}

import * as THREE from "three";
import { AnimationLoader } from "./AnimationLoader.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { SpriteAnimator } from "./SpriteAnimator.js";
import type { IEntityFactory } from "./IEntityFactory.js";
import { GravityComponent } from "./GravityComponent.js";
import { HealthPack } from "./HealthPack.js";
import { HealthComponent } from "./HealthComponent.js";
import { CollisionComponent } from "./CollisionComponent.js";

export class HealthPackFactory implements IEntityFactory {
  private animationLoader: AnimationLoader;

  constructor(animationLoader: AnimationLoader) {
    this.animationLoader = animationLoader;
  }

  createEntity(): HealthPack {
    const animationData = {
      idle: {
        path: "HealthPack/Heart Pickup.png",
        tilesH: 3,
        tilesV: 2,
        numTiles: 6,
        frameDuration: 0.1
      },
    };

    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.animationLoader.loadTexture(animationData.idle.path),
      transparent: true,
      alphaTest: 0.1
    });

    const spriteComponent = new SpriteComponent(spriteMaterial);
    spriteComponent.sprite.scale.set(0.4, 0.4, 0.4);

    for (const [name, data] of Object.entries(animationData)) {
      const tex = this.animationLoader.loadTexture(data.path);
      const animator = new SpriteAnimator(tex, data.tilesH, data.tilesV, data.numTiles, data.frameDuration);
      spriteComponent.addAnimation(name, animator);
    }

    spriteComponent.playAnimation("idle");

    const healthPack = new HealthPack(new THREE.Object3D());
    const healthPackCollision = new CollisionComponent(healthPack.object3D, new THREE.Vector3(0.33, 0.33, 0.33));

    healthPack.addComponent("sprite", spriteComponent);
    healthPack.addComponent("health", new HealthComponent(1));
    healthPack.addComponent("collision", healthPackCollision);
    healthPack.addComponent("gravity", new GravityComponent(healthPack.object3D));
    
    healthPack.object3D.add(spriteComponent.container);
    healthPack.object3D.position.set(5, 5, 0);
    
    return healthPack;
  }
}

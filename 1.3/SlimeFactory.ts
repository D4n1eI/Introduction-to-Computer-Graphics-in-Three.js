import * as THREE from "three";
import { Slime } from "./Slime.js";
import { AnimationLoader } from "./AnimationLoader.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { SpriteAnimator } from "./SpriteAnimator.js";
import type { IEntityFactory } from "./IEntityFactory.js";
import { MovementComponent } from "./MovementComponent.js";
import { CollisionComponent } from "./CollisionComponent.js";
import { AttackRangeComponent } from "./AttackRangeComponent.js";
import { GravityComponent } from "./GravityComponent.js";
import { HealthBarComponent } from "./HealthBarComponent.js";
import { HealthComponent } from "./HealthComponent.js";
import { AttackingComponent } from "./AttackingComponent.js";
import { EventObserver } from "./EventObserver.js";

export class SlimeFactory implements IEntityFactory {
  private animationLoader: AnimationLoader;

  constructor(animationLoader: AnimationLoader) {
    this.animationLoader = animationLoader;
  }

  createEntity(eventObserver?: EventObserver): Slime {
    const animationData = {
      idle: {
        path: "./public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Idle-Sheet.png",
        tilesH: 6,
        tilesV: 1,
        numTiles: 6,
        frameDuration: 0.12
      },

      walk: {
        path: "./public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Jump_Fall-Sheet.png",
        tilesH: 6,
        tilesV: 1,
        numTiles: 6,
        frameDuration: 0.12
      },

      attack: {
        path: "./public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Attack1-Sheet.png",
        tilesH: 8,
        tilesV: 1,
        numTiles: 8,
        frameDuration: 0.17
      },
      hurt: {
        path: "./public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Hurt-Sheet.png",
        tilesH: 4,
        tilesV: 1,
        numTiles: 4,
        frameDuration: 0.15
      },
      death: {
        path: "./public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Monster_Slime/No_Shadows/Monster_Slime_Death-Sheet.png",
        tilesH: 10,
        tilesV: 1,
        numTiles: 10,
        frameDuration: 0.12
      },
    };

    const spriteMaterial = new THREE.SpriteMaterial({
      map: this.animationLoader.loadTexture(animationData.idle.path),
      transparent: true,
      alphaTest: 0.1
    });

    const spriteComponent = new SpriteComponent(spriteMaterial);
    spriteComponent.sprite.scale.set(2, 2, 2);

    for (const [name, data] of Object.entries(animationData)) {
      const tex = this.animationLoader.loadTexture(data.path);
      const animator = new SpriteAnimator(tex, data.tilesH, data.tilesV, data.numTiles, data.frameDuration);
      spriteComponent.addAnimation(name, animator);
    }

    spriteComponent.playAnimation("idle");

    const slime = new Slime(new THREE.Object3D());

    const collision = new CollisionComponent(slime.object3D, new THREE.Vector3(0.33, 0.33, 0.33));
    
    slime.addComponent("collision", collision);
    slime.addComponent("attackRange", new AttackRangeComponent(slime, 1));
    slime.addComponent("sprite", spriteComponent);
    slime.addComponent("movement", new MovementComponent(slime.object3D, 3, 4));
    slime.addComponent("gravity", new GravityComponent(slime.object3D, collision));
    slime.addComponent("health", new HealthComponent(10, eventObserver));
    slime.addComponent("healthbar", new HealthBarComponent(slime.object3D, 0.5, 0.05));
    slime.addComponent("attack",new AttackingComponent(0.8,4));
    slime.object3D.add(spriteComponent.sprite);
    slime.object3D.position.set(2, 2, 0);

    return slime;
  }
}
import * as THREE from "three";
import { Soldier } from "./Soldier.js";
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

export class SoldierFactory implements IEntityFactory {
  private animationLoader: AnimationLoader;

  constructor(animationLoader: AnimationLoader) {
    this.animationLoader = animationLoader;
  }

  createEntity(eventObserver?: EventObserver): Soldier {
    const animationData = {
      idle: {
        path: "/public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Idle-Sheet.png",
        tilesH: 6,
        tilesV: 1,
        numTiles: 6,
        frameDuration: 0.1
      },
      walk: {
        path: "/public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Walk-Sheet.png",
        tilesH: 8,
        tilesV: 1,
        numTiles: 8,
        frameDuration: 0.1
      },
      jump: {
        path: "/public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Jump_Fall-Sheet.png",
        tilesH: 6,
        tilesV: 1,
        numTiles: 6,
        frameDuration: 0.1
      },
      attack: {
        path: "/public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Attack1-Sheet.png",
        tilesH: 8,
        tilesV: 1,
        numTiles: 8,
        frameDuration: 0.1
      },
      hurt: {
        path: "/public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Hurt-Sheet.png",
        tilesH: 4,
        tilesV: 1,
        numTiles: 4,
        frameDuration: 0.125
      },
      death: {
        path: "/public/FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Death-Sheet.png",
        tilesH: 10,
        tilesV: 1,
        numTiles: 10,
        frameDuration: 0.1
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

    const soldier = new Soldier(new THREE.Object3D());

    const collision = new CollisionComponent(soldier.object3D, new THREE.Vector3(0.33, 0.33, 0.33));

    soldier.addComponent("collision", collision);
    soldier.addComponent("attackRange", new AttackRangeComponent(soldier, 1));
    soldier.addComponent("sprite", spriteComponent);
    soldier.addComponent("movement", new MovementComponent(soldier.object3D, 3, 4));
    soldier.addComponent("gravity", new GravityComponent(soldier.object3D, collision));
    soldier.addComponent("health", new HealthComponent(10, eventObserver));
    soldier.addComponent("healthbar", new HealthBarComponent(soldier.object3D, 1, 0.1));
    soldier.addComponent("attack", new AttackingComponent(0.4,0.6));
    soldier.object3D.add(spriteComponent.container);
    soldier.object3D.position.set(-2, 2, 0);
    return soldier;
  }
}
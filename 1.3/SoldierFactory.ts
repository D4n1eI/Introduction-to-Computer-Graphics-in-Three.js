import * as THREE from "three";
import { Soldier } from "./Soldier.js";
import { AnimationLoader } from "./AnimationLoader.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { SpriteAnimator } from "./SpriteAnimator.js";
import { IEntityFactory } from "./IEntityFactory.js";
import { MovementComponent } from "./MovementComponent.js";

export class SoldierFactory implements IEntityFactory {
  private animationLoader: AnimationLoader;

  constructor(animationLoader: AnimationLoader) {
    this.animationLoader = animationLoader;
  }

  createEntity(): Soldier {
    const animationData = {
      idle: { path: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Idle-Sheet.png", tilesH: 6, tilesV: 1, numTiles: 6, frameDuration: 0.05 },
      walk: { path: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Walk-Sheet.png", tilesH: 8, tilesV: 1, numTiles: 8, frameDuration: 0.05 },
    };

    const spriteComponent = new SpriteComponent(new THREE.SpriteMaterial({
      map: this.animationLoader.loadTexture(animationData.idle.path),
      transparent: true,
      alphaTest: 0.1
    }));
    spriteComponent.sprite.scale.set(2, 2, 2);

    for (const [name, data] of Object.entries(animationData)) {
      const tex = this.animationLoader.loadTexture(data.path);
      const animator = new SpriteAnimator(tex, data.tilesH, data.tilesV, data.numTiles, data.frameDuration);
      spriteComponent.addAnimation(name, animator);
    }

    spriteComponent.playAnimation("idle");

    const soldier = new Soldier();

    soldier.addComponent("sprite", spriteComponent);
    soldier.addComponent("movement", new MovementComponent(soldier.object3D, 3, 4));

    soldier.object3D.position.set(0, 0, 0);

    return soldier;
  }
}
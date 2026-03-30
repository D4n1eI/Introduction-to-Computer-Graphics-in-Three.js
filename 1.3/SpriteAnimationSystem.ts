import { Entity } from "./Entity";
import { IUpdatableSystem } from "./IUpdatableSystem";
import { SpriteComponent } from "./SpriteComponent";

export class SpriteAnimationSystem implements IUpdatableSystem {
  private entities: Entity[];

  constructor(entities: Entity[]) {
    this.entities = entities;
  }

  update(delta: number) {
    for (const entity of this.entities) {
      const spriteComp = entity.getComponent<SpriteComponent>("sprite");
      if (!spriteComp) continue;

      spriteComp.animationManager.update(delta);
    }
  }
}
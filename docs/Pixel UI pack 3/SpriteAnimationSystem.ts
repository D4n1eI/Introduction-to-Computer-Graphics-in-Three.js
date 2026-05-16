import { Entity } from "./Entity.js";
import type { IUpdatableSystem } from "./IUpdatableSystem.js";
import { SpriteComponent } from "./SpriteComponent.js";

export class AnimationFrameSystem implements IUpdatableSystem {
    private entities: Entity[];

    constructor(entities: Entity[]) {
        this.entities = entities;
    }

    update(delta: number) {
        for (const entity of this.entities) {
            const sprite = entity.getComponent<SpriteComponent>("sprite");
            if (!sprite) continue;
            sprite.animationManager.update(delta);
        }
    }
}
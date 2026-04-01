import { Entity } from "./Entity";
import { IUpdatableSystem } from "./IUpdatableSystem";
import { SpriteComponent } from "./SpriteComponent";

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
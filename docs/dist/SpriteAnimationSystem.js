export class AnimationFrameSystem {
    entities;
    constructor(entities) {
        this.entities = entities;
    }
    update(delta) {
        for (const entity of this.entities) {
            const sprite = entity.getComponent("sprite");
            if (!sprite)
                continue;
            sprite.animationManager.update(delta);
        }
    }
}

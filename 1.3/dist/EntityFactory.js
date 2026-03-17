import { Soldier } from "./Soldier.js";
import { SpriteComponent } from "./SpriteRenderer.js";
export class EntityFactory {
    animationLoader;
    constructor(animationLoader) {
        this.animationLoader = animationLoader;
    }
    createSoldier() {
        const animations = this.animationLoader.loadEntityAnimations({
            idle: "FreeCharactersAnimationsAssetPack/SpriteSheets(96x96)/Human_Soldier_Sword_Shield/No_Shadows/Human_Soldier_Sword_Shield_Idle-Sheet.png",
        });
        const sprite = new SpriteComponent(animations.idle);
        return new Soldier(sprite);
    }
}

import { Entity } from "./Entity.js";
import { HealthComponent } from "./HealthComponent.js";
import { HealthBarComponent } from "./HealthBarComponent.js";
import { IUpdatableSystem } from "./IUpdatableSystem.js";

export class HealthBarSystem implements IUpdatableSystem {
    Entities: Entity[];

    constructor(Entities: Entity[]) {
        this.Entities = Entities;
    }

    update(delta: number): void {
        for (let entity of this.Entities) {
            const healthComponent = entity.getComponent<HealthComponent>("health");
            const barComponent = entity.getComponent<HealthBarComponent>("healthbar");

            if (!healthComponent || !barComponent) continue;

            const percent = healthComponent.currentHealth / healthComponent.maxHealth;
            barComponent.update(percent);
        }
    }
}
export class HealthBarSystem {
    Entities;
    constructor(Entities) {
        this.Entities = Entities;
    }
    update(delta) {
        for (let entity of this.Entities) {
            const healthComponent = entity.getComponent("health");
            const barComponent = entity.getComponent("healthbar");
            if (!healthComponent || !barComponent)
                continue;
            const percent = healthComponent.currentHealth / healthComponent.maxHealth;
            barComponent.update(percent);
        }
    }
}

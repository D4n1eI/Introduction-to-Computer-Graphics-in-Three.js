import { Entity } from "./Entity.js";
import { HealthPack } from "./HealthPack.js";
import { Soldier } from "./Soldier.js";
import { HealthComponent } from "./HealthComponent.js";
import { CollisionComponent } from "./CollisionComponent.js";
import { IUpdatableSystem } from "./IUpdatableSystem.js";
import { EventObserver } from "./EventObserver.js";

export class HealthPackPickupSystem implements IUpdatableSystem {
    private entities: Entity[];
    private eventObserver?: EventObserver;

    constructor(entities: Entity[], eventObserver?: EventObserver) {
        this.entities = entities;
        this.eventObserver = eventObserver;
    }

    update(delta: number): void {
        const soldier = this.entities.find(e => e instanceof Soldier) as Soldier;
        if (!soldier) return;

        const healthPacks = this.entities.filter(e => e instanceof HealthPack) as HealthPack[];
        const soldierBox = soldier.getComponent<CollisionComponent>("collision")?.collisionBox;
        const soldierHealth = soldier.getComponent<HealthComponent>("health");

        if (!soldierBox || !soldierHealth) return;

        for (const hp of healthPacks) {
            const hpBox = hp.getComponent<CollisionComponent>("collision")?.collisionBox;
            if (hpBox && soldierBox.intersectsBox(hpBox)) {
                soldierHealth.healDamage(5);
                hp.object3D.visible = false;
                
                // Mark for removal from scene
                const hpHealth = hp.getComponent<HealthComponent>("health");
                if (hpHealth) {
                    hpHealth.removalScheduled = true;
                }

                if (this.eventObserver) {
                    this.eventObserver.emit("pickup", { 
                        type: "healthpack", 
                        entity: soldier,
                        healing: 20
                    });
                }
            }
        }
    }
}

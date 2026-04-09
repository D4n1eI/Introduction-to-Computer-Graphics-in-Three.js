import { Slime } from "./Slime.js";
import { HealthComponent } from "./HealthComponent.js";
import { CollisionComponent } from "./CollisionComponent.js";
import { AttackRangeComponent } from "./AttackRangeComponent.js";
import { AttackingComponent } from "./AttackingComponent.js";
import { InputSystem } from "./InputSystem.js";
import { Entity } from "./Entity.js";
import type { IUpdatableSystem } from "./IUpdatableSystem.js";

export class SoldierAttackingSystem implements IUpdatableSystem {

    inputSystem: InputSystem;
    soldierAttack: AttackingComponent;
    soldier: Entity;
    enemies: Entity[];
    damagedEnemiesThisAttack: Set<Entity> = new Set();

    constructor(inputSystem: InputSystem, soldier: Entity, enemies: Entity[]) {
        this.inputSystem = inputSystem;
        this.soldier = soldier;
        this.soldierAttack = soldier.getComponent<AttackingComponent>("attack")!;
        this.enemies = enemies;
    }

    update(delta: number): void {
        if (this.soldierAttack.cooldownTimer > 0)
            this.soldierAttack.cooldownTimer -= delta;
        
        if (this.soldierAttack.isAttacking) {
            this.soldierAttack.attackTimer -= delta;

            // Damage logic
            if (this.soldierAttack.attackTimer < this.soldierAttack.attackDuration * 0.5) {
                const range = this.soldier.getComponent<AttackRangeComponent>("attackRange");
                if (range) {
                    for (const enemy of this.enemies) {
                        if (!this.damagedEnemiesThisAttack.has(enemy) && range.checkCollision(enemy)) {
                            const health = enemy.getComponent<HealthComponent>("health");
                            if (health) {
                                health.takeDamage(1);
                                console.log("Soldier hit Slime! Health:", health.currentHealth);
                                this.damagedEnemiesThisAttack.add(enemy);
                            }
                        }
                    }
                }
            }

            if (this.soldierAttack.attackTimer <= 0) {
                this.soldierAttack.isAttacking = false;
                this.soldierAttack.cooldownTimer = this.soldierAttack.cooldown;
                this.damagedEnemiesThisAttack.clear();
            }
            return;
        }
        if (this.inputSystem.isKeyDown("f") && this.soldierAttack.cooldownTimer <= 0) {
            this.soldierAttack.isAttacking = true;
            this.soldierAttack.attackTimer = this.soldierAttack.attackDuration;
            this.damagedEnemiesThisAttack.clear();
        }
    }
}
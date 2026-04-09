import * as THREE from "three";
import { InputSystem } from "./InputSystem.js";
import type { IUpdatableSystem } from "./IUpdatableSystem.js";
import { Soldier } from "./Soldier.js";
import { AttackingComponent } from "./AttackingComponent.js";
import { AttackRangeComponent } from "./AttackRangeComponent.js";
import { HealthComponent } from "./HealthComponent.js";
import { CollisionComponent } from "./CollisionComponent.js";

export class SlimeAttackingSystem implements IUpdatableSystem {

    slimeAttack: AttackingComponent;
    player: Soldier;
    attackRange: AttackRangeComponent;
    damagedPlayerThisAttack = false;

    constructor(slimeAttack: AttackingComponent, attackRange: AttackRangeComponent, player: Soldier) {
        this.slimeAttack = slimeAttack;
        this.attackRange = attackRange;
        this.player = player;
    }

    update(delta: number) {
        // 1️⃣ Tick cooldown
        if (this.slimeAttack.cooldownTimer > 0) {
            this.slimeAttack.cooldownTimer -= delta;
            if (this.slimeAttack.cooldownTimer < 0) this.slimeAttack.cooldownTimer = 0;
        }

        // 2️⃣ Tick attack timer
        if (this.slimeAttack.isAttacking) {
            this.slimeAttack.attackTimer -= delta;

            // Damage logic: if halfway through animation and hasn't damaged yet
            if (this.slimeAttack.attackTimer < this.slimeAttack.attackDuration * 0.5 && !this.damagedPlayerThisAttack) {
                const playerCollision = this.player.getComponent<CollisionComponent>("collision");
                if (this.attackRange.checkCollision(this.player)) {
                    const playerHealth = this.player.getComponent<HealthComponent>("health");
                    if (playerHealth) {
                        playerHealth.takeDamage(1); // 1 damage
                        console.log("Slime hit Soldier! Health:", playerHealth.currentHealth);
                        this.damagedPlayerThisAttack = true;
                    }
                }
            }

            if (this.slimeAttack.attackTimer <= 0) {
                this.slimeAttack.isAttacking = false;
                this.slimeAttack.cooldownTimer = this.slimeAttack.cooldown; // Set cooldown **before checking new attack**
                this.damagedPlayerThisAttack = false;
                console.log("Attack finished. Cooldown started:", this.slimeAttack.cooldownTimer);
            }
            return; // Prevent new attack in the same frame
        }

        // 3️⃣ Only start new attack if cooldown is done
        if (this.attackRange.checkCollision(this.player) && this.slimeAttack.cooldownTimer <= 0) {
            this.slimeAttack.isAttacking = true;
            this.slimeAttack.attackTimer = this.slimeAttack.attackDuration;
            this.damagedPlayerThisAttack = false;
            console.log("New attack started!");
        }
    }
}
import * as THREE from "three";
import { InputSystem } from "./InputSystem";
import { IUpdatableSystem } from "./IUpdatableSystem";
import { Soldier } from "./Soldier";
import { AttackingComponent } from "./AttackingComponent";
import { AttackRangeComponent } from "./AttackRangeComponent";

export class SlimeAttackingSystem implements IUpdatableSystem {

    slimeAttack: AttackingComponent;
    player: Soldier;
    attackRange: AttackRangeComponent;

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

            if (this.slimeAttack.attackTimer <= 0) {
                this.slimeAttack.isAttacking = false;
                this.slimeAttack.cooldownTimer = this.slimeAttack.cooldown; // Set cooldown **before checking new attack**
                console.log("Attack finished. Cooldown started:", this.slimeAttack.cooldownTimer);
            }
            return; // Prevent new attack in the same frame
        }

        // 3️⃣ Only start new attack if cooldown is done
        if (this.attackRange.checkCollision(this.player) && this.slimeAttack.cooldownTimer <= 0) {
            this.slimeAttack.isAttacking = true;
            this.slimeAttack.attackTimer = this.slimeAttack.attackDuration;
            console.log("New attack started!");
        }
    }
}
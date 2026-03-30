import * as THREE from "three";
import { InputSystem } from "./InputSystem";
import { IUpdatableSystem } from "./IUpdatableSystem";
import { Soldier } from "./Soldier";
import { AttackingComponent } from "./AttackingComponent";

export class SoldierAttackingSystem implements IUpdatableSystem {

    inputSystem: InputSystem;
    soldierAttack: AttackingComponent;

    constructor(inputSystem: InputSystem, soldierAttack: AttackingComponent) {
        this.inputSystem = inputSystem;
        this.soldierAttack = soldierAttack;
    }

    update(delta: number): void {
        if (this.soldierAttack.cooldownTimer > 0)
            this.soldierAttack.cooldownTimer -= delta;
        if (this.soldierAttack.isAttacking) {
            this.soldierAttack.attackTimer -= delta;

            if (this.soldierAttack.attackTimer <= 0) {
                this.soldierAttack.isAttacking = false;
                this.soldierAttack.cooldownTimer = this.soldierAttack.cooldown;
            }
            return;
        }
        if (this.inputSystem.isKeyDown("f") && this.soldierAttack.cooldownTimer <= 0) {
            this.soldierAttack.isAttacking = true;
            this.soldierAttack.attackTimer = this.soldierAttack.attackDuration;
        }
    }
}
import { IComponent } from "./IComponent";
import { SpriteComponent } from "./SpriteComponent";
import * as THREE from "three";

export class HealthComponent implements IComponent {
    currentHealth: number;
    maxHealth: number;
    isDead: boolean;
    hurtTimer: number = 0;

    constructor(maxHealth: number) {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.isDead = false;
    }

    takeDamage(damage: number): void {
        if (this.isDead) return; 

        this.currentHealth -= damage;
        this.hurtTimer = 0.5; // Trigger hurt state for 0.5 seconds

        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.isDead = true;
        }
    }

    update(delta: number): void {
        if (this.hurtTimer > 0) {
            this.hurtTimer -= delta;
            if (this.hurtTimer < 0) this.hurtTimer = 0;
        }
    }

    healDamage(heal: number): void {
        if (this.isDead) return; 

        this.currentHealth += heal;

        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
    }

}
import { IComponent } from "./IComponent";
import { SpriteComponent } from "./SpriteComponent";
import * as THREE from "three";

export class HealthComponent implements IComponent {
    currentHealth: number;
    maxHealth: number;
    isDead: boolean;
    hurtTimer: number = 0;
    deathAnimationTimer: number = 0;
    removalScheduled: boolean = false;

    constructor(maxHealth: number) {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.isDead = false;
    }

    takeDamage(damage: number): void {
        if (this.isDead) return; 

        this.currentHealth -= damage;
        
        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.isDead = true;
            this.deathAnimationTimer = 1.0; // 10 frames * 0.1 duration
        } else {
            this.hurtTimer = 0.5; // Trigger hurt state for 0.5 seconds
        }
    }

    update(delta: number): void {
        if (this.hurtTimer > 0) {
            this.hurtTimer -= delta;
            if (this.hurtTimer < 0) this.hurtTimer = 0;
        }
        
        if (this.isDead && this.deathAnimationTimer > 0) {
            this.deathAnimationTimer -= delta;
            if (this.deathAnimationTimer <= 0) {
                this.deathAnimationTimer = 0;
                this.removalScheduled = true;
            }
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
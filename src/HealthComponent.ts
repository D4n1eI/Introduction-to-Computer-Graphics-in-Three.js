import { IComponent } from "./IComponent.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { EventObserver } from "./EventObserver.js";
import * as THREE from "three";

export class HealthComponent implements IComponent {
    currentHealth: number;
    maxHealth: number;
    isDead: boolean;
    hurtTimer: number = 0;
    deathAnimationTimer: number = 0;
    removalScheduled: boolean = false;
    private eventObserver?: EventObserver;

    constructor(maxHealth: number, eventObserver?: EventObserver) {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.isDead = false;
        this.eventObserver = eventObserver;
    }

    takeDamage(damage: number): void {
        if (this.isDead) return; 

        this.currentHealth -= damage;
        
        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.isDead = true;
            this.deathAnimationTimer = 1.0; 
            if (this.eventObserver) {
                this.eventObserver.emit("death");
            }
        } else {
            this.hurtTimer = 0.5;
            if (this.eventObserver) {
                this.eventObserver.emit("hurt");
            }
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
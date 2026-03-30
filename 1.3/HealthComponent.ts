import { IComponent } from "./IComponent";
import { SpriteComponent } from "./SpriteComponent";
import * as THREE from "three";

export class HealthComponent implements IComponent {
    currentHealth: number;
    maxHealth: number;
    isDead: boolean;

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
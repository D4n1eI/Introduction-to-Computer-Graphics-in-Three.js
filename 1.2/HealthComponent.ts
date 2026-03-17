import * as THREE from "three";

export class HealthComponent {
  maxHealth: number;
  currentHealth: number;
  isAlive: boolean;

  constructor(maxHealth: number) {
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.isAlive = true;
  }

  takeDamage(amount: number) {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
    if (this.currentHealth <= 0) this.isAlive = false;
  }

  get fraction(): number {
    return this.currentHealth / this.maxHealth;
  }
}
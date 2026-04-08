export class HealthComponent {
    currentHealth;
    maxHealth;
    isDead;
    constructor(maxHealth) {
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.isDead = false;
    }
    takeDamage(damage) {
        if (this.isDead)
            return;
        this.currentHealth -= damage;
        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.isDead = true;
        }
    }
    healDamage(heal) {
        if (this.isDead)
            return;
        this.currentHealth += heal;
        if (this.currentHealth > this.maxHealth) {
            this.currentHealth = this.maxHealth;
        }
    }
}

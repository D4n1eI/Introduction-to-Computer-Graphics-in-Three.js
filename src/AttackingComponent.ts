export class AttackingComponent {
    isAttacking = false;
    wasAttacking = false;

    attackDuration: number;
    attackTimer = 0;

    cooldown: number;
    cooldownTimer = 0;

    constructor(attackDuration: number, cooldown: number) {
        this.attackDuration = attackDuration;
        this.cooldown = cooldown;
    }
}
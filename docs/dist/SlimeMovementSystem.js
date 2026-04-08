import * as THREE from "three";
var SlimeState;
(function (SlimeState) {
    SlimeState[SlimeState["Wander"] = 0] = "Wander";
    SlimeState[SlimeState["Breathing"] = 1] = "Breathing";
    SlimeState[SlimeState["Seek"] = 2] = "Seek";
})(SlimeState || (SlimeState = {}));
export class SlimeMovementSystem {
    movement;
    state = SlimeState.Wander;
    currentDirection;
    timer = 0;
    walkDuration = 1.5;
    breatheDuration = 2;
    speed = 0.4;
    player;
    constructor(movement, player) {
        this.movement = movement;
        this.player = player;
        this.currentDirection = this.generateDirection();
    }
    update(delta) {
        this.timer += delta;
        switch (this.state) {
            case SlimeState.Wander:
                this.movement.setVelocity(this.currentDirection.x * this.speed, 0, this.currentDirection.z * this.speed);
                if (this.timer >= this.walkDuration) {
                    this.timer = 0;
                    this.state = SlimeState.Breathing;
                }
                break;
            case SlimeState.Breathing:
                this.movement.setVelocity(0, 0, 0);
                if (this.timer >= this.breatheDuration) {
                    this.timer = 0;
                    this.currentDirection = this.generateDirection();
                    this.state = SlimeState.Wander;
                }
                break;
            case SlimeState.Seek:
                break;
        }
    }
    generateDirection() {
        const dir = new THREE.Vector3().randomDirection();
        dir.y = 0;
        dir.normalize();
        return dir;
    }
}

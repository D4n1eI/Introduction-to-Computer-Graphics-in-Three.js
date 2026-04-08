export class GravityComponent {
    object3D;
    velocityY = 0;
    gravity = -9.8;
    collision;
    jumpPower;
    constructor(object3D, collision, jumpPower = 3) {
        this.object3D = object3D;
        this.collision = collision;
        this.jumpPower = jumpPower;
    }
    update(delta) {
        if (!(this.collision?.isOnGround)) {
            this.velocityY += this.gravity * delta;
            this.object3D.position.y += this.velocityY * delta;
        }
        else if (this.velocityY < 0) {
            this.resetVelocity();
        }
    }
    resetVelocity() {
        this.velocityY = 0;
    }
    jump() {
        if (this.collision?.isOnGround) {
            this.velocityY = this.jumpPower;
            this.collision.isOnGround = false;
        }
    }
}

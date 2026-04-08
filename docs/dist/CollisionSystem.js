export class CollisionSystem {
    Entities;
    constructor(Entities) {
        this.Entities = Entities;
    }
    update(delta) {
        const originalPositions = new Map();
        // Reset ground state before processing collisions
        for (let entity of this.Entities) {
            const collision = entity.getComponent("collision");
            if (collision) {
                collision.isOnGround = false;
            }
        }
        // Compute approximate pre-update positions for this frame
        for (let entity of this.Entities) {
            const collisionBox = entity.getComponent("collision");
            if (!collisionBox)
                continue;
            const movement = entity.getComponent("movement");
            const gravity = entity.getComponent("gravity");
            let originalPos = entity.object3D.position.clone();
            // Revert horizontal movement from MovementComponent
            if (movement && movement.velocity.lengthSq() > 0) {
                const step = movement.velocity.clone();
                if (step.length() > movement.maxSpeed) {
                    step.setLength(movement.maxSpeed);
                }
                step.multiplyScalar(movement.speed * delta);
                originalPos.sub(step);
            }
            // Revert vertical displacement from GravityComponent
            if (gravity) {
                const gravityStepY = gravity.velocityY * delta;
                originalPos.y -= gravityStepY;
            }
            originalPositions.set(entity, originalPos);
            collisionBox.update(delta);
        }
        for (let entity of this.Entities) {
            const collisionBox = entity.getComponent("collision");
            if (!collisionBox)
                continue;
            for (let otherEntity of this.Entities) {
                if (entity === otherEntity)
                    continue;
                const otherCollisionBox = otherEntity.getComponent("collision");
                if (!otherCollisionBox)
                    continue;
                if (collisionBox.checkCollision(otherCollisionBox)) {
                    const gravity = entity.getComponent("gravity");
                    const boxA = collisionBox.collisionBox;
                    const boxB = otherCollisionBox.collisionBox;
                    const height = boxA.max.y - boxA.min.y;
                    const originalPos = originalPositions.get(entity);
                    const isFalling = gravity && gravity.velocityY <= 0;
                    let wasAbove = false;
                    if (originalPos) {
                        const originalBottom = originalPos.y - height / 2;
                        wasAbove = originalBottom >= boxB.max.y - 0.05;
                    }
                    if (isFalling && wasAbove) {
                        entity.object3D.position.y = boxB.max.y + height / 2;
                        if (gravity)
                            gravity.resetVelocity();
                        collisionBox.isOnGround = true;
                    }
                    else {
                        if (originalPos) {
                            entity.object3D.position.copy(originalPos);
                        }
                    }
                    entity.object3D.updateMatrixWorld(true);
                    collisionBox.update(delta);
                }
            }
        }
    }
}

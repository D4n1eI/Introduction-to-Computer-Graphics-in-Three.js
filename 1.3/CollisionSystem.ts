import * as THREE from "three";
import { CollisionComponent } from "./CollisionComponent.js";
import { MovementComponent } from "./MovementComponent.js";
import { Entity } from "./Entity.js";
import { IUpdatableSystem } from "./IUpdatableSystem.js";
import { GravityComponent } from "./GravityComponent.js";
import { HealthPack } from "./HealthPack.js";
import { Block } from "./Block.js";
import { HealthComponent } from "./HealthComponent.js";

export class CollisionSystem implements IUpdatableSystem {
	Entities: Entity[];
    
    constructor(Entities: Entity[]) {
        this.Entities = Entities;
    }
    
    update(delta: number): void {
        const originalPositions = new Map<Entity, THREE.Vector3>();

        // Reset ground state before processing collisions
        for (let entity of this.Entities) {
            const collision = entity.getComponent<CollisionComponent>("collision");
            if (collision) {
                collision.isOnGround = false;
            }
        }

        // Compute approximate pre-update positions for this frame
        for (let entity of this.Entities) {
            const collisionBox = entity.getComponent<CollisionComponent>("collision");
            if (!collisionBox) continue;

            const movement = entity.getComponent<MovementComponent>("movement");
            const gravity = entity.getComponent<GravityComponent>("gravity");

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
            const collisionBox = entity.getComponent<CollisionComponent>("collision");
            if (!collisionBox) continue;

            for (let otherEntity of this.Entities) {
                if (entity === otherEntity) continue;

                // HealthPack only collides physically with blocks/ground
                if (entity instanceof HealthPack && !(otherEntity instanceof Block)) {
                    continue;
                }
                
                // Other entities (Soldier, etc.) don't collide physically with HealthPack
                if (otherEntity instanceof HealthPack) {
                    continue;
                }

                // Dead entities still collide with ground (Blocks)
                const health = entity.getComponent<HealthComponent>("health");
                if (health && health.isDead && !(otherEntity instanceof Block)) continue;
                
                // Active entities don't collide with dead things
                const otherHealth = otherEntity.getComponent<HealthComponent>("health");
                if (otherHealth && otherHealth.isDead) continue;

                const otherCollisionBox = otherEntity.getComponent<CollisionComponent>("collision");
                if (!otherCollisionBox) continue;

                if (collisionBox.checkCollision(otherCollisionBox)) {

                    const gravity = entity.getComponent<GravityComponent>("gravity");

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

                        if (gravity) gravity.resetVelocity();
                        collisionBox.isOnGround = true;

                    } else {

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

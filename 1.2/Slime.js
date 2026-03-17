import { SpriteAnimationManager } from "./SpriteAnimationManager.js";
import { SpriteAnimator } from "./SpriteAnimator.js";
import * as THREE from "three";
import { Entity } from "./Entity.js";
"use strict";
export class Slime extends Entity {
    constructor(animationPaths, speed = 1, scene) {
        super(animationPaths, speed, scene)
        this.addAnimation("slimeIdle", new SpriteAnimator(this.animationsData.idle.map, 6, 1, 6, 1000 / 12));
        this.addAnimation("slimeWalk", new SpriteAnimator(this.animationsData.walk.map, 8, 1, 8, 1000 / 12));
        this.addAnimation("slimeAttack1", new SpriteAnimator(this.animationsData.attack1.map, 8, 1, 8, 1000 / 12));
        this.addAnimation("slimeAttack2", new SpriteAnimator(this.animationsData.attack2.map, 8, 1, 8, 1000 / 12));
        this.addAnimation("slimeJump", new SpriteAnimator(this.animationsData.jump.map, 6, 1, 6, 1000 / 12));
        this.addAnimation("slimeDeath", new SpriteAnimator(this.animationsData.death.map, 10, 1, 10, 1000 / 12));
        this.detectionRangeSize = 1.5;
        this.detectionRangeBox = new THREE.Box3();
        this.detectionRangeBox.setFromCenterAndSize(
            this.sprite.position,
            new THREE.Vector3(this.detectionRangeSize, this.detectionRangeSize, this.detectionRangeSize)
        );
        this.detectionRangeBoxHelper = new THREE.Box3Helper(this.detectionRangeBox,0xffff00);
        scene.add(this.detectionRangeBoxHelper);

        this.attackRangeSize = 0.5;
        this.attackRangeBox = new THREE.Box3();
        this.attackRangeBox.setFromCenterAndSize(
            this.sprite.position,
            new THREE.Vector3(this.attackRangeSize, this.attackRangeSize, this.attackRangeSize)
        );
        this.attackRangeBoxHelper = new THREE.Box3Helper(this.attackRangeBox,0xff00ff);
        scene.add(this.attackRangeBoxHelper);
        this.isAttacking = false;
        this.deathAnimationTime = (10/12)*1000;
        this.attackDuration =  (12 / 12) * 1000;
        this.attackDamage = 1;
        this.hitFrame = 6;
        this.frameDuration = 1000 / 12;
        this.hitTime = this.hitFrame * this.frameDuration;
    }

    lookForPlayer(delta){
        if (!this.isAlive) return;
        if (!Entity.player || !Entity.player.isAlive) return;
        
        if (this.detectionRangeBox.intersectsBox(Entity.player.collisionBox)){
            const move = new THREE.Vector3().subVectors(Entity.player.sprite.position,this.sprite.position);
            this.direction.copy(move).multiplyScalar(this.speed*delta);
            if (this.direction.x !== 0) {
                this.lastDirection.x = this.direction.x;
            }

            const nextBoxCollision = this.collisionBox.clone();
            nextBoxCollision.translate(this.direction);

            let colliding = false;
            Entity.allEntities.forEach(other => {
                if (other !== this && nextBoxCollision.intersectsBox(other.collisionBox)) {
                    colliding = true;
                }
            });

            if (!colliding) {
                if (!this.isAttacking){
                this.sprite.position.x+=this.direction.x;
                this.sprite.position.z+=this.direction.z;
                this.updateCollisionBox();
                this.updateAttackRangeBox();
                
                if (this.attackRangeBox.intersectsBox(Entity.player.collisionBox)) {
                    this.attack()
                } else {
                    this.playAnimation("slimeJump");
                }
            }
            }
        }
        else{
            this.playAnimation("slimeIdle")
        }
    }

    attack() {
        if (!this.isAlive || this.isAttacking || !Entity.player || !Entity.player.isAlive) return;

        this.isAttacking=true;
        this.playAnimation("slimeAttack1");

        setTimeout(() => {
            if (!this.isAlive || !Entity.player || !Entity.player.isAlive) return;
            this.updateAttackRangeBox();
            if (this.attackRangeBox.intersectsBox(Entity.player.collisionBox)) {
                Entity.player.takeDamage(this.attackDamage);
            }
        }, this.hitTime);

        setTimeout(()=>{
            this.isAttacking=false;
            if (this.isAlive) {
                this.playAnimation("slimeIdle");
            }
        },this.attackDuration)
    }

    update(delta){
        super.update(delta);
        this.updateDetectionRangeBox();
        this.updateAttackRangeBox();
    }

    die(){
        super.die()
        this.playAnimation("slimeDeath")
    }

}
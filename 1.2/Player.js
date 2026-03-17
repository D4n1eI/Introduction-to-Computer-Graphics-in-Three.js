import { SpriteAnimationManager } from "./SpriteAnimationManager.js";
import { SpriteAnimator } from "./SpriteAnimator.js";
import * as THREE from "three";
import { Entity } from "./Entity.js";
"use strict";

export class Player extends Entity {
  constructor(animationPaths, speed = 2, scene) {
    super(animationPaths, speed, scene)
    this.nextAttack = 1;
    this.addAnimation("playerIdle", new SpriteAnimator(this.animationsData.idle.map, 6, 1, 6, 1000 / 12));
    this.addAnimation("playerWalk", new SpriteAnimator(this.animationsData.walk.map, 8, 1, 6, 1000 / 12));
    this.addAnimation("playerAttack1", new SpriteAnimator(this.animationsData.attack1.map, 8, 1, 8, 1000 / 12));
    this.addAnimation("playerAttack2", new SpriteAnimator(this.animationsData.attack2.map, 8, 1, 8, 1000 / 12));
    this.addAnimation("playerDeath", new SpriteAnimator(this.animationsData.death.map, 10, 1, 10, 1000 / 12));
    this.addAnimation("playerBlock", new SpriteAnimator(this.animationsData.block.map, 6, 1, 8, 1000 / 12));
    this.addAnimation("playerJump", new SpriteAnimator(this.animationsData.jump.map, 6, 1, 6, 1000 / 12));
    this.attackRangeSize = 0.5;
    this.attackRangeBox = new THREE.Box3();
    this.attackRangeBox.setFromCenterAndSize(
        this.sprite.position,
        new THREE.Vector3(this.attackRangeSize, this.attackRangeSize, this.attackRangeSize)
    );
    this.attackRangeBoxHelper = new THREE.Box3Helper(this.attackRangeBox,0xff0011);
    scene.add(this.attackRangeBoxHelper);
    this.attackDamage = 1;
    this.entitiesHitThisAttack = []
    this.deathAnimationTime = (10/12)*1000;
    Entity.player = this;
    this.attackDuration = (8 / 12) * 1000;
    this.hitFrame = 4.5;
    this.frameDuration = 1000 / 12; 
    this.hitTime = this.hitFrame * this.frameDuration;
  }


  attack() {
    if (this.attackCooldown || !this.isAlive) return; 
    this.entitiesHitThisAttack = []

    const attackName = `playerAttack${this.nextAttack}`;
    this.playAnimation(attackName);

    this.updateAttackRangeBox();

    for (let entity of Entity.allEntities){
      if (entity!==this && entity.isAlive && this.attackRangeBox.intersectsBox(entity.collisionBox) &&!this.entitiesHitThisAttack.includes(entity)){
        setTimeout(() => {
          entity.takeDamage(this.attackDamage)
          this.entitiesHitThisAttack.push(entity)

        }, this.hitTime);
      }
    }

    this.attackCooldown = true;
    this.isAttacking = true;


    setTimeout(() => {
      this.attackCooldown = false;
      this.isAttacking = false;
      this.nextAttack = this.nextAttack === 1 ? 2 : 1;
      if (this.isAlive) {
        this.playAnimation("playerIdle");
      }
      this.entitiesHitThisAttack = []
    }, this.attackDuration);
  }


  jump() {
    if (!this.isGrounded) return;
    this.velocity.y = this.jumpForce;
    this.isGrounded = false;
  }


  updatePhysics(delta) {
    this.velocity.y -= this.gravity * delta;

    this.sprite.position.y += this.velocity.y * delta;

    if (this.sprite.position.y <= 0) {
      this.sprite.position.y = 0;
      this.velocity.y = 0;
      this.isGrounded = true;
    }
  }


  updateAnimation() {
    if (!this.isGrounded) {
      if (this.currentAnimation !== "playerJump") {
        this.playAnimation("playerJump");
        this.currentAnimation = "playerJump";
      }
    } else if(this.direction.length() > 0) {
      if (this.currentAnimation !== "playerWalk") {
        this.playAnimation("playerWalk");
        this.currentAnimation = "playerWalk";
      }
    } else if(!this.isAlive) {
      this.playAnimation("playerDeath")
      this.currentAnimation = "playerDeath"
    } 
    else {
      if (this.currentAnimation !== "playerIdle") {
        this.playAnimation("playerIdle");
        this.currentAnimation = "playerIdle";
      }
    } 
  }

  handleMovement(keys, delta) {
    if (!this.isAlive) return;
    
    this.direction.set(0,0,0);
    if (keys["w"]) this.direction.z -= 1;
    if (keys["s"]) this.direction.z += 1;
    if (keys["d"]) this.direction.x += 1;
    if (keys["a"]) this.direction.x -= 1;
    this.updateAttackRangeBox()
        
    if (this.direction.length() > 0) {
      this.direction.normalize();
      
      if (this.direction.x!==0){
        this.lastDirection.x = this.direction.x;
      }
      const nextPosition = this.sprite.position.clone().add(this.direction.clone().multiplyScalar(this.speed*delta));
      const nextBox = this.collisionBox.clone();

      const translation = new THREE.Vector3().subVectors(nextPosition,this.sprite.position);

      nextBox.translate(translation);

      let colliding = false;
      Entity.allEntities.forEach(other => {
          if (other !== this && nextBox.intersectsBox(other.collisionBox)) {
              colliding = true;
          }
      });
      if (!colliding) {
          this.sprite.position.add(translation);
          this.updateCollisionBox();
      }

    }

    if(keys[" "] && this.isGrounded) this.jump();
  
    this.updateAnimation();
  }

  update(delta) {
    super.update(delta);
    this.updateAttackRangeBox();
  }


  die() {
    super.die()
    this.playAnimation("playerDeath");
  }
  
}



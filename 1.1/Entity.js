import * as THREE from "three";
import { SpriteAnimationManager } from "./SpriteAnimationManager.js";
import { SpriteAnimator } from "./SpriteAnimator.js";
import { GameObject } from "./GameObject.js"
import { HealthBar } from "./HealthBar.js"
import { AnimationLoader } from "./AnimationLoader.js"
"use strict";

export class Entity extends GameObject {
  static allEntities = [];
  static player = null;
  static loader = new AnimationLoader();

  constructor(animationPaths, speed = 1, scene) {
    super();
    this.animationsData = Entity.loader.loadEntityAnimations(animationPaths);
    this.direction = new THREE.Vector3(0, 0, 0);
    this.sprite = new THREE.Sprite(this.animationsData.idle);
    this.object3D = this.sprite;
    this.animationManager = new SpriteAnimationManager(this.sprite);
    this.speed = speed;
    this.attackRangeBox = null;
    this.attackRangeSize = null;
    this.detectionRangeBox = null;
    this.detectionRangeSize = null;
    this.lastDirection = new THREE.Vector3(1,0,0);
    this.isAlive = true;
    this.attackCooldown = false;
    this.isAttacking = false;
    this.velocity = new THREE.Vector3();
    this.gravity = 9.8;
    this.jumpForce = 3;
    this.maxHealthPoints = 5;
    this.healthPoints = this.maxHealthPoints;
    this.scene = scene;
    Entity.allEntities.push(this);
    this.scene.add(this.collisionBoxHelper)
    this.position = this.sprite.position; 
    this.scene.add(this.sprite);
    this.healthBar = new HealthBar(this,this.scene,"Pixel Health Pack/healthbar3.png",{tilesHoriz: 2,
      tilesVert: 3,
      bgFrame: { row: 1, col: 0 },
      fillFrame: { row: 1, col: 1 },
      offset: 0.15
    })
    this.deathAnimationTime = (6/12)*1000;
  }

  addAnimation(name, animator) {
      this.animationManager.addAnimation(name, animator);
  }




  playAnimation(name) {
      this.animationManager.play(name);

      this.sprite.material.map.repeat.x =
        this.lastDirection.x >= 0
          ? Math.abs(this.sprite.material.map.repeat.x)
          : -Math.abs(this.sprite.material.map.repeat.x);
  }

  move(delta) {
      if (this.direction.length() > 0) {
      this.direction.normalize();

      if (this.direction.x !== 0) {
          this.lastDirection.x = this.direction.x;
      }

      this.sprite.position.x += this.direction.x * this.speed * delta;
      this.sprite.position.z += this.direction.z * this.speed * delta;
      }
  }

  update(delta) {
    this.animationManager.update(delta);
    this.updateCollisionBox();
  }


  updateAttackRangeBox() {
    if (this.attackRangeBox) {
      this.attackRangeBox.setFromCenterAndSize(
          this.sprite.position,
          new THREE.Vector3(this.attackRangeSize, this.attackRangeSize, this.attackRangeSize)
      );
    }
  }

  updateDetectionRangeBox() {
    if (this.detectionRangeBox) {
      this.detectionRangeBox.setFromCenterAndSize(
          this.sprite.position,
          new THREE.Vector3(this.detectionRangeSize, this.detectionRangeSize, this.detectionRangeSize)
      );
    }
  }

  takeDamage(damage) {
    if (!this.isAlive) return;

    this.healthPoints = Math.max(0, this.healthPoints - damage);

    if (this.healthBar) {
      this.healthBar.setHealth(this.healthPoints / this.maxHealthPoints);
    }

    if (this.healthPoints <= 0) {
      this.die();
    }
  }

  die() {
    this.isAlive = false;
    
    setTimeout(() => {
        this.scene.remove(this.sprite);
        this.scene.remove(this.collisionBoxHelper);
        this.scene.remove(this.detectionRangeBoxHelper);
        this.scene.remove(this.attackRangeBoxHelper);
        this.scene.remove(this.collisionBox)
        this.scene.remove(this.healthBar.bgSprite);
        this.scene.remove(this.healthBar.fillSprite);
        
        const index = Entity.allEntities.indexOf(this);
        if (index > -1) {
            Entity.allEntities.splice(index, 1);
        }
    }, this.deathAnimationTime);
  }

}
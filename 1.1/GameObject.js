import * as THREE from "three";
"use strict";
export class GameObject{
    constructor(){
        this.object3D = null;
        this.collisionBox = new THREE.Box3(
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(1, 1, 1)
        );
        this.collisionBoxHelper = new THREE.Box3Helper(this.collisionBox,0x00ff00);
    }


    checkCollision(other) {
        return this.collisionBox.intersectsBox(other.collisionBox);
    }


    updateCollisionBox() {
        if (!this.object3D) {
            console.error("updateCollisionBox called but object3D is null. Subclass must set this.object3D!");
            return;
        }
        const width = this.object3D.scale.x * 0.2;   
        const height = this.object3D.scale.y * 0.2; 
        const depth = this.object3D.scale.z * 0.2;
        this.collisionBox.setFromCenterAndSize(
            this.object3D.position,
            new THREE.Vector3(width, height, depth)
        );
    }


    getPosition() {
         return this.object3D.position; 
    }

    
    setPosition(x, y, z) { 
        this.object3D.position.set(x, y, z); 
    }

}
import * as THREE from "three";
export class CollisionComponent {
    object3D;
    collisionBox;
    collisionBoxHelper;
    constructor(object3D) {
        this.object3D = object3D;
        this.collisionBox = new THREE.Box3(new THREE.Vector3(-0.4, -0.4, -0.4), new THREE.Vector3(0.4, 0.4, 0.4));
        this.collisionBoxHelper = new THREE.Box3Helper(this.collisionBox, 0x00ff00);
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
        this.collisionBox.setFromCenterAndSize(this.object3D.position, new THREE.Vector3(width, height, depth));
    }
}

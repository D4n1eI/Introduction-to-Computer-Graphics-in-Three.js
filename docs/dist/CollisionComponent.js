import * as THREE from "three";
export class CollisionComponent {
    object3D;
    collisionBox;
    collisionBoxHelper;
    localBox;
    useMeshBounds;
    isOnGround;
    constructor(object3D, size) {
        this.object3D = object3D;
        this.collisionBox = new THREE.Box3();
        if (size) {
            this.localBox = new THREE.Box3(size.clone().multiplyScalar(-0.5), size.clone().multiplyScalar(0.5));
            this.useMeshBounds = false;
        }
        else {
            const box = new THREE.Box3().setFromObject(object3D);
            const localSize = new THREE.Vector3();
            box.getSize(localSize);
            this.localBox = new THREE.Box3(localSize.clone().multiplyScalar(-0.5), localSize.clone().multiplyScalar(0.5));
            this.useMeshBounds = false;
        }
        this.collisionBoxHelper = new THREE.Box3Helper(this.collisionBox, 0x00ff00);
        this.isOnGround = false;
    }
    checkCollision(other) {
        return this.collisionBox.intersectsBox(other.collisionBox);
    }
    update(delta) {
        this.object3D.updateMatrixWorld(true);
        if (this.localBox) {
            this.collisionBox.copy(this.localBox);
            this.collisionBox.applyMatrix4(this.object3D.matrixWorld);
        }
        else {
            this.collisionBox.setFromObject(this.object3D);
        }
        this.collisionBoxHelper.box.copy(this.collisionBox);
        this.collisionBoxHelper.updateMatrixWorld(true);
    }
}

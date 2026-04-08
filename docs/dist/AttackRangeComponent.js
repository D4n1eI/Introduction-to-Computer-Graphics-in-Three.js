import * as THREE from "three";
export class AttackRangeComponent {
    owner;
    size;
    box;
    constructor(owner, size) {
        this.owner = owner;
        this.size = size;
        this.box = new THREE.Box3();
    }
    update(delta) {
        const object3D = this.owner.object3D;
        if (!object3D) {
            throw new Error("AttackRangeComponent: owner.object3D is null or undefined");
        }
        const width = this.size;
        const height = this.size;
        const depth = this.size;
        this.box.setFromCenterAndSize(object3D.position, new THREE.Vector3(width, height, depth));
    }
    checkCollision(other) {
        const otherCollision = other.getComponent("collision");
        if (!otherCollision) {
            return false;
        }
        return this.box.intersectsBox(otherCollision.collisionBox);
    }
}

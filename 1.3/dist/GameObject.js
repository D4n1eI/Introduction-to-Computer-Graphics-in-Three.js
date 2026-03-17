import { CollisionComponent } from "./CollisionComponent.js";
export class GameObject {
    object3D;
    collisionComponent;
    constructor(object3D) {
        this.object3D = object3D;
        this.collisionComponent = new CollisionComponent(this.object3D);
    }
    getPosition() {
        return this.object3D.position;
    }
    setPosition(x, y, z) {
        this.object3D.position.set(x, y, z);
    }
    update(delta) {
        this.collisionComponent.updateCollisionBox();
    }
}

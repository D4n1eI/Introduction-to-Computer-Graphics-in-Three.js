export class GameObject {
    object3D;
    collisionComponent;
    constructor(object3D, collisionComponent) {
        this.object3D = object3D;
        this.collisionComponent = collisionComponent;
    }
    getPosition() {
        return this.object3D.position;
    }
    setPosition(x, y, z) {
        this.object3D.position.set(x, y, z);
    }
    update(delta) {
        this.collisionComponent?.update(delta);
    }
}

import * as THREE from "three";
import { CollisionComponent } from "./CollisionComponent.js";
import { Entity } from "./Entity.js";
export class Block extends Entity {
    constructor(width, depth, height = 1) {
        super(new THREE.Object3D());
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial({ color: 0x808080 });
        const mesh = new THREE.Mesh(geometry, material);
        this.object3D.add(mesh);
        const collision = new CollisionComponent(this.object3D);
        this.addComponent("collision", collision);
    }
}

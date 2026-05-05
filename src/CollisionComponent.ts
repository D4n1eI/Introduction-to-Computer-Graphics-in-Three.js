import * as THREE from "three";
import { IUpdatableComponent } from "./IUpdatableComponent";

export class CollisionComponent implements IUpdatableComponent {
  object3D: THREE.Object3D;

  collisionBox: THREE.Box3;
  collisionBoxHelper?: THREE.Box3Helper;

  private localBox?: THREE.Box3;
  private useMeshBounds: boolean;

  isOnGround: boolean;

  constructor(object3D: THREE.Object3D, size?: THREE.Vector3) {
    this.object3D = object3D;
    this.collisionBox = new THREE.Box3();

    if (size) {
      // Custom size provided
      this.localBox = new THREE.Box3(
        size.clone().multiplyScalar(-0.5),
        size.clone().multiplyScalar(0.5)
      );
      this.useMeshBounds = false;
    } else if (object3D instanceof THREE.Mesh && object3D.geometry) {
      // TIGHT collision box: use only the mesh geometry bounds (no children, no padding)
      const mesh = object3D as THREE.Mesh;
      if (!mesh.geometry.boundingBox) {
        mesh.geometry.computeBoundingBox();
      }
      this.localBox = mesh.geometry.boundingBox!.clone();
      this.useMeshBounds = true;
    } else {
      // Fallback: use object bounds
      const box = new THREE.Box3().setFromObject(object3D);
      const localSize = new THREE.Vector3();
      box.getSize(localSize);
      
      this.localBox = new THREE.Box3(
        localSize.clone().multiplyScalar(-0.5),
        localSize.clone().multiplyScalar(0.5)
      );
      this.useMeshBounds = false; 
    }

    this.collisionBoxHelper = new THREE.Box3Helper(this.collisionBox, 0x00ff00);
    this.isOnGround = false;
  }

  checkCollision(other: { collisionBox: THREE.Box3 }): boolean {
    return this.collisionBox.intersectsBox(other.collisionBox);
  }

  // Set collision box bounds (for enlarging floor, etc.)
  setCollisionBounds(min: THREE.Vector3, max: THREE.Vector3): void {
    if (!this.localBox) {
      this.localBox = new THREE.Box3();
    }
    this.localBox.min.copy(min);
    this.localBox.max.copy(max);
  }

  update(delta: number): void {
    this.object3D.updateMatrixWorld(true);

    if (this.localBox) {
      this.collisionBox.copy(this.localBox);
      this.collisionBox.applyMatrix4(this.object3D.matrixWorld);
    } else {
      this.collisionBox.setFromObject(this.object3D);
    }

    if (this.collisionBoxHelper) {
      this.collisionBoxHelper.box.copy(this.collisionBox);
      this.collisionBoxHelper.updateMatrixWorld(true);
    }
  }

  enableDebug(scene: THREE.Scene): void {
    if (!this.collisionBoxHelper) {
      this.collisionBoxHelper = new THREE.Box3Helper(this.collisionBox, 0x00ff00);
      scene.add(this.collisionBoxHelper);
    }
  }

  disableDebug(scene: THREE.Scene): void {
    if (this.collisionBoxHelper) {
      scene.remove(this.collisionBoxHelper);
      this.collisionBoxHelper = undefined;
    }
  }
}
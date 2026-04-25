import * as THREE from "three";
import { GameObject } from "./GameObject.js";
import { GameMapLoader } from "./GameMapLoader.js";
import { CollisionComponent } from "./CollisionComponent.js";

export class GameMap {
    gltfLoader: GameMapLoader;
    gameObjects: GameObject[] = [];

    constructor(gltfLoader: GameMapLoader) {
        this.gltfLoader = gltfLoader;
    }

   getInstance(onReady: (model: THREE.Object3D, gameObjects: GameObject[]) => void) {

    this.gltfLoader.loadMap("map-model/map.glb", (model) => {

        model.updateMatrixWorld(true);

        const result: GameObject[] = [];

        model.traverse((child) => {

            if (!(child instanceof THREE.Mesh)) return;

            const mesh = child as THREE.Mesh;

              if ((child as THREE.Mesh).isMesh) {
                child.scale.setScalar(0.2);
            }


            mesh.updateMatrixWorld(true);

            // Create TIGHT collision box using only this mesh's geometry
            let tightBox: THREE.Box3;
            
            if (mesh.geometry && mesh.geometry.boundingBox) {
                // Use existing bounding box
                tightBox = mesh.geometry.boundingBox.clone();
            } else if (mesh.geometry) {
                // Compute bounding box from geometry only (not children)
                mesh.geometry.computeBoundingBox();
                tightBox = mesh.geometry.boundingBox!.clone();
            } else {
                // Fallback: create empty box
                tightBox = new THREE.Box3();
            }


            // Create game object for this mesh
            const gameObject = new GameObject(mesh);

            // Create collision component with tight bounds
            const collision = new CollisionComponent(mesh);
            gameObject.collisionComponent = collision;

            // ENLARGE floor collision box to cover entire floor area
            if (mesh.name.toLowerCase().includes("floor")) {
                collision.setCollisionBounds(
                    new THREE.Vector3(-100, -1, -100),
                    new THREE.Vector3(100, 1, 100)
                );
                console.log("✓ Enlarged floor collision box");
            }

            result.push(gameObject);
        });
        
        this.gameObjects = result;

        onReady(model, result);
    });
}
}
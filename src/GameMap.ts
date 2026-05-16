import * as THREE from "three";
import { GameObject } from "./GameObject.js";
import { GameMapLoader } from "./GameMapLoader.js";
import { CollisionComponent } from "./CollisionComponent.js";
import { assetUrl } from "./assetUrl.js";

export class GameMap {
    gltfLoader: GameMapLoader;
    gameObjects: GameObject[] = [];

    constructor(gltfLoader: GameMapLoader) {
        this.gltfLoader = gltfLoader;
    }

   private makeMapMaterialUnlit(material: THREE.Material): THREE.Material {
    const source = material as THREE.MeshStandardMaterial;
    const basicMaterial = new THREE.MeshBasicMaterial({
        map: source.map ?? null,
        color: source.color ?? new THREE.Color(0xffffff),
        transparent: source.transparent,
        opacity: source.opacity,
        alphaTest: source.alphaTest,
        side: source.side
    });

    basicMaterial.name = material.name;
    basicMaterial.needsUpdate = true;
    return basicMaterial;
   }

   getInstance(onReady: (model: THREE.Object3D, gameObjects: GameObject[]) => void) {

    this.gltfLoader.loadMap(assetUrl("map-model/map.glb"), (model) => {

        model.updateMatrixWorld(true);

        const result: GameObject[] = [];

        model.traverse((child) => {

            if (!(child instanceof THREE.Mesh)) return;

            const mesh = child as THREE.Mesh;

            if (Array.isArray(mesh.material)) {
                mesh.material = mesh.material.map((material) => this.makeMapMaterialUnlit(material));
            } else {
                mesh.material = this.makeMapMaterialUnlit(mesh.material);
            }

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

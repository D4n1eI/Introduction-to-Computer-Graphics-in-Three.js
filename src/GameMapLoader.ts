import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export class GameMapLoader {
    loader: GLTFLoader;

    constructor(loader: GLTFLoader) {
        this.loader = loader;
    }

    loadMap(
        path: string,
        onLoad: (model: THREE.Object3D) => void
    ) {
        this.loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;

                model.scale.set(0.4, 0.4, 0.4);
                model.position.set(0, -3, 0);

                onLoad(model); // ✔ correct callback usage
            },
            undefined,
            (error) => {
                console.error("GLB load error:", error);
            }
        );
    }
}
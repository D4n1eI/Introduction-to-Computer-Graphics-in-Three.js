import * as THREE from "three";
import { type IComponent } from "./IComponent.js";

export class HealthBarComponent implements IComponent {
    private barMesh: THREE.Sprite;
    private maxBarWidth: number;
    private textures: THREE.Texture[] = [];

    constructor(parent: THREE.Object3D, width: number = 2, height: number = 0.2) {
        this.maxBarWidth = width;
        const barY = 0.6; 

        const loader = new THREE.TextureLoader();

        // Load all 11 health bar textures (0 to 10)
        for (let i = 0; i <= 10; i++) {
            const fileName = `health_${i.toString().padStart(2, '0')}.png`;
            const tex = loader.load(`/public/Pastinhas/${fileName}`);
            tex.magFilter = THREE.NearestFilter;
            tex.minFilter = THREE.NearestFilter;
            this.textures.push(tex);
        }

        // Initially use health_10 (full)
        const initialTexture = this.textures[10];
        if (!initialTexture) {
          throw new Error("Health bar textures not loaded properly");
        }
        const barMat = new THREE.SpriteMaterial({ map: initialTexture, transparent: true });
        this.barMesh = new THREE.Sprite(barMat);
        
        this.barMesh.scale.set(width, height, 1);
        this.barMesh.position.set(0, barY, 0.01); 
        parent.add(this.barMesh);
    }

    update(percent: number): void {
        const p = Math.max(0, Math.min(1, percent));
        // Calculate index (0 to 10)
        const index = Math.round(p * 10);
        const texture = this.textures[index];
        if (texture && this.barMesh.material.map !== texture) {
            this.barMesh.material.map = texture;
            this.barMesh.material.needsUpdate = true;
        }
    }

}
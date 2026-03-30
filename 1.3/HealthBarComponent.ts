import * as THREE from "three";
import { IComponent } from "./IComponent";

export class HealthBarComponent implements IComponent {
    private barMesh: THREE.Mesh;
    private maxBarWidth: number;

    constructor(parent: THREE.Object3D, width: number = 2, height: number = 0.2) {
        this.maxBarWidth = width;
        const barY = 0.5; // Uniform height for both bars

        // Background (gray)
        const bgGeo = new THREE.PlaneGeometry(width, height);
        const bgMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
        const bgMesh = new THREE.Mesh(bgGeo, bgMat);
        bgMesh.position.y = barY; 
        parent.add(bgMesh);

        // Health bar (red)
        const barGeo = new THREE.PlaneGeometry(1, height);
        barGeo.translate(0.5, 0, 0);
        
        const barMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        this.barMesh = new THREE.Mesh(barGeo, barMat);
        
        this.barMesh.scale.x = width;
        this.barMesh.position.set(-width / 2, barY, 0.01); 
        parent.add(this.barMesh);
    }

    update(percent: number): void {
        const p = Math.max(0, Math.min(1, percent));
        this.barMesh.scale.x = p * this.maxBarWidth;
    }

}
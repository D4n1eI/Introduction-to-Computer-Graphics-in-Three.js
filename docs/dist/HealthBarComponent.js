import * as THREE from "three";
export class HealthBarComponent {
    barMesh;
    maxBarWidth;
    constructor(parent, width = 2, height = 0.2) {
        this.maxBarWidth = width;
        const barY = 0.6;
        const loader = new THREE.TextureLoader();
        // Background (gray - frame 00)
        const bgTex = loader.load("Pixel UI pack 3/00.png");
        bgTex.magFilter = THREE.NearestFilter;
        bgTex.minFilter = THREE.NearestFilter;
        const bgMat = new THREE.SpriteMaterial({ map: bgTex, transparent: true });
        const bgMesh = new THREE.Sprite(bgMat);
        bgMesh.scale.set(width, height, 1);
        bgMesh.position.y = barY;
        parent.add(bgMesh);
        // Health bar (red - frame 01)
        const barTex = loader.load("Pixel UI pack 3/01.png");
        barTex.magFilter = THREE.NearestFilter;
        barTex.minFilter = THREE.NearestFilter;
        const barMat = new THREE.SpriteMaterial({ map: barTex, transparent: true });
        this.barMesh = new THREE.Sprite(barMat);
        this.barMesh.center.set(0, 0.5); // Center left
        this.barMesh.scale.set(width, height, 1);
        this.barMesh.position.set(-width / 2, barY, 0.01);
        parent.add(this.barMesh);
    }
    update(percent) {
        const p = Math.max(0, Math.min(1, percent));
        this.barMesh.scale.x = p * this.maxBarWidth;
    }
}

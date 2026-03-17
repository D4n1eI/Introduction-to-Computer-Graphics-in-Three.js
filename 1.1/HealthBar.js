import * as THREE from "three";
import { GameObject } from "./GameObject.js";
"use strict";
export class HealthBar extends GameObject {
 
    constructor(entity, scene, imagePath, options = {}) {
        super();
        this.entity = entity;
        this.scene = scene;

        const tilesHoriz = options.tilesHoriz ?? 2;
        const tilesVert = options.tilesVert ?? 3;
        const bgFrame = options.bgFrame ?? { row: 1, col: 0 };
        const fillFrame = options.fillFrame ?? { row: 1, col: 1 };
        this.offset = options.offset ?? 0.01;

        const loader = new THREE.TextureLoader();
        const texture = loader.load(imagePath);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;

        const bgTexture = texture.clone();
        bgTexture.repeat.set(1 / tilesHoriz, 1 / tilesVert);
        bgTexture.offset.set(bgFrame.col / tilesHoriz, 1 - (bgFrame.row + 1) / tilesVert);
        this.bgSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: bgTexture, transparent: true }));
        this.bgSprite.renderOrder = 1; 
        scene.add(this.bgSprite);

        const fillTexture = texture.clone();
        fillTexture.repeat.set(1 / tilesHoriz, 1 / tilesVert);
        fillTexture.offset.set(fillFrame.col / tilesHoriz, 1 - (fillFrame.row + 1) / tilesVert);
        this.fillSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: fillTexture, transparent: true }));
        this.fillSprite.renderOrder = 0; 
        this.fillSprite.center.set(0, 0.5); 
        scene.add(this.fillSprite);

        this.fillSprite.scale.set(0.3,0.3,0.3)
        this.bgSprite.scale.set(0.3,0.3,0.3)
        this.fillTexture = fillTexture;
        this.baseFillScaleX = this.fillSprite.scale.x;

        this.tileWidth = 1 / tilesHoriz;
        this.baseOffsetX = fillFrame.col / tilesHoriz;
        this.fillTexture.wrapS = THREE.ClampToEdgeWrapping;


        this.setHealth(1);
    }

    updatePosition(camera) {
        if (!this.entity || !this.entity.sprite) return;

        const basePos = this.entity.sprite.position;
        this.bgSprite.position.set(basePos.x, basePos.y + this.offset, basePos.z);

        // Camera-aligned fill offset
        const cameraDir = new THREE.Vector3();
        camera.getWorldDirection(cameraDir);
        const right = new THREE.Vector3().crossVectors(cameraDir, new THREE.Vector3(0, 1, 0)).normalize();

        this.fillSprite.position.copy(this.bgSprite.position).add(right.multiplyScalar(-0.5 * this.bgSprite.scale.x));
    }

    setHealth(fraction) {
        const clampedFraction = THREE.MathUtils.clamp(fraction, 0, 1);

        this.fillTexture.repeat.x = this.tileWidth * clampedFraction;
        this.fillTexture.offset.x = this.baseOffsetX;
        this.fillSprite.scale.x = this.baseFillScaleX * clampedFraction;

        this.fillTexture.needsUpdate = true;
    }
    
    destroy() {
        this.scene.remove(this.bgSprite);
        this.scene.remove(this.fillSprite);
    }
}
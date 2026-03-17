import * as THREE from "three";
import { HealthBar } from "./HealthBar";
import { HealthBarFactory } from "./HealthBarFactory";

export class HealthBarRenderer {
  healthBar: HealthBar;
  scene: THREE.Scene;

  bgSprite!: THREE.Sprite;
  fillSprite!: THREE.Sprite;
  fillTexture!: THREE.Texture;
  baseFillScaleX!: number;
  tileWidth!: number;
  baseOffsetX!: number;

  constructor(healthBar: HealthBar, scene: THREE.Scene, imagePath: string) {
    this.healthBar = healthBar;
    this.scene = scene;

    const { bgTexture, fillTexture } = HealthBarFactory.createTextures(
      imagePath,
      healthBar.tilesHoriz,
      healthBar.tilesVert,
      healthBar.bgFrame,
      healthBar.fillFrame
    );

    const { bgSprite, fillSprite } = HealthBarFactory.createSprites(bgTexture, fillTexture);

    this.bgSprite = bgSprite;
    this.fillSprite = fillSprite;
    this.fillTexture = fillTexture;

    // Add to scene
    this.scene.add(this.bgSprite);
    this.scene.add(this.fillSprite);

    // Scaling and tile info
    this.bgSprite.scale.set(0.3, 0.3, 0.3);
    this.fillSprite.scale.set(0.3, 0.3, 0.3);
    this.baseFillScaleX = this.fillSprite.scale.x;
    this.tileWidth = 1 / healthBar.tilesHoriz;
    this.baseOffsetX = healthBar.fillFrame.col / healthBar.tilesHoriz;

    this.updateVisual();
    this.updatePosition();
  }

  updateVisual(): void {
    const fraction = this.healthBar.fraction;
    this.fillTexture.repeat.x = this.tileWidth * fraction;
    this.fillTexture.offset.x = this.baseOffsetX;
    this.fillSprite.scale.x = this.baseFillScaleX * fraction;
    this.fillTexture.needsUpdate = true;
  }

  updatePosition(camera?: THREE.Camera): void {
    if (!this.healthBar.entity.object3D) return;
    const basePos = this.healthBar.entity.object3D.position;

    this.bgSprite.position.set(basePos.x, basePos.y + this.healthBar.offset, basePos.z);

    if (camera) {
      const cameraDir = new THREE.Vector3();
      camera.getWorldDirection(cameraDir);
      const right = new THREE.Vector3().crossVectors(cameraDir, new THREE.Vector3(0, 1, 0)).normalize();
      this.fillSprite.position.copy(this.bgSprite.position).add(right.multiplyScalar(-0.5 * this.bgSprite.scale.x));
    } else {
      this.fillSprite.position.copy(this.bgSprite.position);
    }
  }

  destroy(): void {
    this.scene.remove(this.bgSprite);
    this.scene.remove(this.fillSprite);
  }
}
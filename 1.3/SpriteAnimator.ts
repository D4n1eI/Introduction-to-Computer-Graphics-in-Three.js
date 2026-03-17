// SpriteAnimator.ts
import * as THREE from "three";

export class SpriteAnimator {
  texture: THREE.Texture;
  tilesHorizontal: number;
  tilesVertical: number;
  numberOfTiles: number;
  tileDisplayDuration: number;
  currentTile: number;
  currentDisplayTime: number;

  constructor(
    texture: THREE.Texture,
    tilesHoriz: number,
    tilesVert: number,
    numTiles: number,
    tileDisplayDuration: number
  ) {
    this.texture = texture;
    this.tilesHorizontal = tilesHoriz;
    this.tilesVertical = tilesVert;
    this.numberOfTiles = numTiles;
    this.tileDisplayDuration = tileDisplayDuration;
    this.currentTile = 0;
    this.currentDisplayTime = 0;

    this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
    this.texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);
  }

  reset(): void {
    this.currentTile = 0;
    this.currentDisplayTime = 0;
    this.texture.offset.set(0, 1 - 1 / this.tilesVertical);
  }

  update(delta: number): void {
    this.currentDisplayTime += delta;

    while (this.currentDisplayTime >= this.tileDisplayDuration) {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;

      if (this.currentTile >= this.numberOfTiles) {
        this.currentTile = 0;
      }

      const currentColumn = this.currentTile % this.tilesHorizontal;
      const currentRow = Math.floor(this.currentTile / this.tilesHorizontal);

      this.texture.offset.x = currentColumn / this.tilesHorizontal;
      this.texture.offset.y = 1 - (currentRow + 1) / this.tilesVertical;
    }
  }
}
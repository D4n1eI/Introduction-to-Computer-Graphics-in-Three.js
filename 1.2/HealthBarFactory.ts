import * as THREE from "three";

export class HealthBarFactory {
  static createTextures(imagePath: string, tilesHoriz: number, tilesVert: number, bgFrame: {row:number,col:number}, fillFrame: {row:number,col:number}) {
    const loader = new THREE.TextureLoader();
    const baseTexture = loader.load(imagePath);
    baseTexture.colorSpace = THREE.SRGBColorSpace;
    baseTexture.minFilter = THREE.NearestFilter;
    baseTexture.magFilter = THREE.NearestFilter;
    baseTexture.generateMipmaps = false;

    const bgTexture = baseTexture.clone();
    bgTexture.repeat.set(1 / tilesHoriz, 1 / tilesVert);
    bgTexture.offset.set(bgFrame.col / tilesHoriz, 1 - (bgFrame.row + 1) / tilesVert);

    const fillTexture = baseTexture.clone();
    fillTexture.repeat.set(1 / tilesHoriz, 1 / tilesVert);
    fillTexture.offset.set(fillFrame.col / tilesHoriz, 1 - (fillFrame.row + 1) / tilesVert);
    fillTexture.wrapS = THREE.ClampToEdgeWrapping;

    return { bgTexture, fillTexture };
  }

  static createSprites(bgTexture: THREE.Texture, fillTexture: THREE.Texture): {bgSprite: THREE.Sprite, fillSprite: THREE.Sprite} {
    const bgSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: bgTexture, transparent: true }));
    bgSprite.renderOrder = 1;

    const fillSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: fillTexture, transparent: true }));
    fillSprite.renderOrder = 0;
    fillSprite.center.set(0, 0.5);

    return { bgSprite, fillSprite };
  }
}
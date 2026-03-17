// AnimationLoader.js
import * as THREE from "three";

export class AnimationLoader {
  constructor(loader = new THREE.TextureLoader()) {
    this.loader = loader;
  }

  loadSpriteMaterial(path) {
    const texture = this.loader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    return new THREE.SpriteMaterial({ map: texture, transparent: true, alphaTest: 0.1 });
  }

  loadEntityAnimations(animationPaths) {
    const animations = {};
    for (const [key, path] of Object.entries(animationPaths)) {
      animations[key] = this.loadSpriteMaterial(path);
    }
    return animations;
  }
}
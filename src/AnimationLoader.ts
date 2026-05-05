// AnimationLoader.js
import * as THREE from "three";

export class AnimationLoader {
  loader : THREE.TextureLoader;
  constructor(loader: THREE.TextureLoader = new THREE.TextureLoader()) {
    this.loader = loader;
  }

  loadTexture(path: string): THREE.Texture {
    const texture = this.loader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    return texture;
  }

  loadEntityAnimations(animationPaths: Record<string,string>): Record<string, THREE.Texture> {
    const animations: Record<string, THREE.Texture> = {};
    for (const key in animationPaths) {
      if (animationPaths[key]) {
        animations[key] = this.loadTexture(animationPaths[key]);
      }
    }
    return animations;
  }
}
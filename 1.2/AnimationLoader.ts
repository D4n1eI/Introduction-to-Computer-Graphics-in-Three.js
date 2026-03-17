// AnimationLoader.js
import * as THREE from "three";

export class AnimationLoader {
  loader : THREE.TextureLoader;
  constructor(loader: THREE.TextureLoader = new THREE.TextureLoader()) {
    this.loader = loader;
  }

  loadSpriteMaterial(path: string) : THREE.SpriteMaterial {
    const texture = this.loader.load(path);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.generateMipmaps = false;
    return new THREE.SpriteMaterial({ map: texture, transparent: true, alphaTest: 0.1 });
  }

  loadEntityAnimations(animationPaths:Record<string,string>) : Record<string,THREE.SpriteMaterial>{
    const animations :Record<string, THREE.SpriteMaterial> = {};
    for (const [key, path] of Object.entries(animationPaths)) {
      animations[key] = this.loadSpriteMaterial(path);
    }
    return animations;
  }
}
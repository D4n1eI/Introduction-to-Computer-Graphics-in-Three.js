// AnimationLoader.js
import * as THREE from "three";
export class AnimationLoader {
    loader;
    constructor(loader = new THREE.TextureLoader()) {
        this.loader = loader;
    }
    loadTexture(path) {
        const texture = this.loader.load(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.NearestFilter;
        texture.magFilter = THREE.NearestFilter;
        texture.generateMipmaps = false;
        return texture;
    }
    loadEntityAnimations(animationPaths) {
        const animations = {};
        for (const key in animationPaths) {
            animations[key] = this.loadTexture(animationPaths[key]);
        }
        return animations;
    }
}

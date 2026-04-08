import * as THREE from "three";
import { Entity } from "./Entity.js";
export class SceneSystem {
    scene;
    cameras = [];
    lights = [];
    gameObjects = [];
    activeCamera = null;
    renderer;
    constructor(options) {
        this.renderer = options.renderer;
        this.scene = new THREE.Scene();
        this._setupScene();
    }
    _setupScene() {
        this.scene.background = new THREE.Color(0xeeeeee);
        this.scene.fog = new THREE.Fog(0xeeeeee, 10, 100);
    }
    addCamera(camera, setActive = false) {
        this.cameras.push(camera);
        if (setActive || !this.activeCamera)
            this.activeCamera = camera;
    }
    addLight(light) {
        this.lights.push(light);
        this.scene.add(light);
    }
    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
        this.scene.add(gameObject.object3D);
        const collision = gameObject.collisionComponent || (gameObject instanceof Entity ? gameObject.getComponent("collision") : undefined);
        const helper = collision?.collisionBoxHelper;
        if (helper) {
            helper.updateMatrixWorld(true);
            helper.visible = true;
            this.scene.add(helper);
        }
    }
    addHelper(component) {
    }
    removeGameObject(gameObject) {
        this.scene.remove(gameObject.object3D);
        this.gameObjects = this.gameObjects.filter(obj => obj !== gameObject);
    }
    update(delta) {
        for (const obj of this.gameObjects) {
            obj.update(delta);
        }
    }
    render() {
        if (!this.activeCamera)
            return;
        this.renderer.render(this.scene, this.activeCamera);
    }
}

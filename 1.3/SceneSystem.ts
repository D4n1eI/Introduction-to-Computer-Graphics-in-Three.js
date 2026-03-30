import * as THREE from "three";
import { IUpdatableSystem } from "./IUpdatableSystem.js";
import { GameObject } from "./GameObject.js";
import { Entity } from "./Entity.js";
import { CollisionComponent } from "./CollisionComponent.js";

interface SceneSystemOptions {
  renderer: THREE.WebGLRenderer;
  canvas?: HTMLCanvasElement;
}

export class SceneSystem implements IUpdatableSystem {
  public scene: THREE.Scene;
  public cameras: THREE.Camera[] = [];
  public lights: THREE.Light[] = [];
  public gameObjects: GameObject[] = [];
  public activeCamera: THREE.Camera | null = null;

  private renderer: THREE.WebGLRenderer;

  constructor(options: SceneSystemOptions) {
    this.renderer = options.renderer;
    this.scene = new THREE.Scene();
    this._setupScene();
  }

  private _setupScene() {
    this.scene.background = new THREE.Color(0xeeeeee);
    this.scene.fog = new THREE.Fog(0xeeeeee, 10, 100);
  }

  addCamera(camera: THREE.Camera, setActive = false) {
    this.cameras.push(camera);
    if (setActive || !this.activeCamera) this.activeCamera = camera;
  }

  addLight(light: THREE.Light) {
    this.lights.push(light);
    this.scene.add(light);
  }

  addGameObject(gameObject: GameObject) {
    this.gameObjects.push(gameObject);
    this.scene.add(gameObject.object3D);

    const collision = gameObject.collisionComponent || (gameObject instanceof Entity ? gameObject.getComponent<CollisionComponent>("collision") : undefined);
    const helper = collision?.collisionBoxHelper;

    if (helper) {
      helper.updateMatrixWorld(true);
      helper.visible = true;
      this.scene.add(helper);
    }
  }

  removeGameObject(gameObject: GameObject) {
    this.scene.remove(gameObject.object3D);
    this.gameObjects = this.gameObjects.filter(obj => obj !== gameObject);
  }

  update(delta: number) {
    for (const obj of this.gameObjects) {
      obj.update(delta); 
    }
  }

  render() {
    if (!this.activeCamera) return;
    this.renderer.render(this.scene, this.activeCamera);
  }
}
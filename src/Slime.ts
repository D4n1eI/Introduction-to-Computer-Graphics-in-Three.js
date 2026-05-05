import * as THREE from "three";
import { Entity } from "./Entity.js";


export class Slime extends Entity {
  constructor(object3D : THREE.Object3D) {
    super(object3D);
  }
}

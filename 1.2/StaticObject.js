import { GameObject } from "./GameObject.js";
import * as THREE from "three";
"use strict";


export class StaticObject extends GameObject{
    static allStaticObjects = []
    constructor(material,options={}){
        super();
        this.sprite = new THREE.Sprite(material); 
          if (options.position) {
            this.mesh.position.set(
            options.position.x || 0,
            options.position.y || 0,
            options.position.z || 0
            );
        }
        
        if (options.rotation) {
            this.mesh.rotation.set(
            options.rotation.x || 0,
            options.rotation.y || 0,
            options.rotation.z || 0
            );
        }
        
        if (options.scale) {
            this.mesh.scale.set(
            options.scale.x || 1,
            options.scale.y || 1,
            options.scale.z || 1
            );
        }
        StaticObject.allStaticObjects.push(this);
    }

    static createWall(x, y, z, material) {
        return new StaticObject(
            new THREE.BoxGeometry(1, 1, 1),
            material,
            { position: {x, y, z} }
        );
    }
}

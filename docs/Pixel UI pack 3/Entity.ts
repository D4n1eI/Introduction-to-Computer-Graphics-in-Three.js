import * as THREE from "three";
import { GameObject } from "./GameObject.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { IComponent } from "./IComponent.js";
import { IUpdatableComponent } from "./IUpdatableComponent.js";

export abstract class Entity extends GameObject {
  components: Map<string, IComponent> = new Map();

  constructor(object3D:THREE.Object3D,initialComponents?:Record<string,IComponent>){
    super(object3D);

    if (initialComponents){
      for(const [name,component] of Object.entries(initialComponents)){
        this.addComponent(name,component);
      }
    }
  }
  addComponent(name:string,component:IComponent){
    this.components.set(name,component);
  }

  getComponent<T extends IComponent>(name:string): T{
    return this.components.get(name) as T;
  }

  private isUpdatableComponent(component: IComponent): component is IUpdatableComponent {
    return typeof (component as IUpdatableComponent).update === "function";
  }

  update(delta: number) {
    super.update(delta);
    for (const component of this.components.values()) {
      if (this.isUpdatableComponent(component)) {
        component.update(delta);
      }
    }
  }


}
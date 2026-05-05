import { IComponent } from "./IComponent";

export interface IUpdatableComponent extends IComponent{
    update(delta: number): void;
}
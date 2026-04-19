import { Entity } from "./Entity";
import { EventObserver } from "./EventObserver";

export interface IEntityFactory {
  createEntity(eventObserver?: EventObserver): Entity;
}
import { Entity } from "./Entity";

export interface IEntityFactory {
  createEntity(): Entity;
}
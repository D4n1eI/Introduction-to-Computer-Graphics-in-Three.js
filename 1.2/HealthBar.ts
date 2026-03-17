import { Entity } from "./Entity";
import { HealthComponent } from "./HealthComponent";

export interface HealthBarOptions {
  offset?: number;
  tilesHoriz?: number;
  tilesVert?: number;
  bgFrame?: { row: number; col: number };
  fillFrame?: { row: number; col: number };
}

export class HealthBar {
  entity: Entity;
  healthComponent: HealthComponent;
  offset: number;
  tilesHoriz: number;
  tilesVert: number;
  bgFrame: { row: number; col: number };
  fillFrame: { row: number; col: number };

  constructor(
    entity: Entity,
    healthComponent: HealthComponent,
    options: HealthBarOptions = {}
  ) {
    this.entity = entity;
    this.healthComponent = healthComponent;
    this.offset = options.offset ?? 0.01;
    this.tilesHoriz = options.tilesHoriz ?? 2;
    this.tilesVert = options.tilesVert ?? 3;
    this.bgFrame = options.bgFrame ?? { row: 1, col: 0 };
    this.fillFrame = options.fillFrame ?? { row: 1, col: 1 };
  }

  get fraction(): number {
    // Clamp fraction between 0 and 1
    return Math.max(0, Math.min(1, this.healthComponent.fraction));
  }
}
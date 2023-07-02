// Cell represents of pair of coordinates in a grid
export interface Cell {
  x: number
  y: number
}

// TileNoId represents a Tile with no id and no coordinates
export interface TileNoId {
  value: number
  isNew?: boolean
  markedForDeletion?: boolean
  mergedFrom?: [Tile, Tile] | null
}

// Tile represents a Tile with a unique id
export interface Tile extends TileNoId {
  id: number
}

// TileInCell is a Tile with the Cell coordinates it occupies
export type TileInCell = Tile & Cell

export interface Vector {
  x: number
  y: number
}
export interface VectorMap {
  [key: string]: Vector
}

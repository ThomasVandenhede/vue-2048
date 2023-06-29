export interface Cell {
  col: number
  row: number
}

export interface TileNoId extends Cell {
  value: number
  isNew?: boolean
  markedForDeletion?: boolean
  mergedFrom?: [number, number] | null
}

export interface Tile extends TileNoId {
  id: number
}

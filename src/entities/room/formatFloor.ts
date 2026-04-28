export function formatFloorLabel(floor: number): string {
  return floor === 0 ? 'Цоколь' : `${floor} этаж`
}

export function formatFloorValue(floor: number): string {
  return floor === 0 ? 'Цоколь' : String(floor)
}

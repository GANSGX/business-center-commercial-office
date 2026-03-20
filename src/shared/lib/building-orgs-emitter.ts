import { EventEmitter } from 'events'

declare global {
  // eslint-disable-next-line no-var
  var __buildingOrgsEmitter: EventEmitter | undefined
}

const buildingOrgsEmitter = globalThis.__buildingOrgsEmitter ?? new EventEmitter()
globalThis.__buildingOrgsEmitter = buildingOrgsEmitter
buildingOrgsEmitter.setMaxListeners(200)

export { buildingOrgsEmitter }

import { EventEmitter } from 'events'

// Глобальный синглтон — переживает hot-reload в dev-режиме
declare global {
  // eslint-disable-next-line no-var
  var __dashboardEmitter: EventEmitter | undefined
}

const dashboardEmitter = globalThis.__dashboardEmitter ?? new EventEmitter()
globalThis.__dashboardEmitter = dashboardEmitter
dashboardEmitter.setMaxListeners(100)

export { dashboardEmitter }

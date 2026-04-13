import { EventEmitter } from 'events'

// Глобальный синглтон — переживает hot-reload в dev-режиме
declare global {
  // eslint-disable-next-line no-var
  var __leadsEmitter: EventEmitter | undefined
}

const leadsEmitter = globalThis.__leadsEmitter ?? new EventEmitter()
globalThis.__leadsEmitter = leadsEmitter
leadsEmitter.setMaxListeners(100) // много вкладок админки

export { leadsEmitter }

import { EventEmitter } from 'events'

declare global {
  // eslint-disable-next-line no-var
  var __tenantRequestsEmitter: EventEmitter | undefined
}

const tenantRequestsEmitter = globalThis.__tenantRequestsEmitter ?? new EventEmitter()
globalThis.__tenantRequestsEmitter = tenantRequestsEmitter
tenantRequestsEmitter.setMaxListeners(100)

export { tenantRequestsEmitter }

import 'dotenv/config'
import { ManagedRuntime } from 'effect'
import { AppRuntimeLayer } from './infrastructure/runtime.js'
import { createApp } from './presentation/http/create-app.js'

const runtime = ManagedRuntime.make(AppRuntimeLayer)
const app = createApp(runtime)

const port = Number(process.env.PORT ?? 3001)
const server = app.listen(port, () => {
  console.log(`@razconms/backend http://localhost:${port}`)
})

const shutdown = async () => {
  server.close()
  await runtime.dispose()
  process.exit(0)
}

process.once('SIGINT', () => {
  void shutdown()
})
process.once('SIGTERM', () => {
  void shutdown()
})

export default defineEventHandler(async (event) => {
  await readBody(event).catch(() => null)
  setResponseStatus(event, 204)
  return null
})

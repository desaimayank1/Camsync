import { Hono ,HonoRequest } from "hono"
import { serve } from '@hono/node-server'
import dotenv from "dotenv"
import { cors } from 'hono/cors'
import { authRoute } from "./routes/auth.routes";
import { cameraRoute } from "./routes/camera.routes";

const app = new Hono();
dotenv.config()

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use('*',cors({
    origin: 'http://localhost:5173',
    credentials:true,
    // origin: "*",
}))

// app.use(cors())

app.get('/', (c) => c.text('Camsync is running...'));

app.route("/auth", authRoute)
app.route("/camera", cameraRoute)

app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})

app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})

if (process.env.NODE_ENV !== 'production') {
  serve({
  fetch: app.fetch,
  port: 3000,
})
}
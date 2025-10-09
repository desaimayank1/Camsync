import {Hono} from "hono"
import { Camera } from "../controllers/camera.controllers"
import { authMiddleware } from "../middlewares/auth.middleware";
export const cameraRoute = new Hono()

cameraRoute.use("*",authMiddleware);
cameraRoute.get('/setup', Camera)
// cameraRoute.get('/login', userLogin)
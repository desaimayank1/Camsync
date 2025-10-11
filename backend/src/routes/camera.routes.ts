import { Hono } from "hono"
import { addCamera, getCamera, updateCamera, deleteCamera } from "../controllers/camera.controllers"
import { authMiddleware } from "../middlewares/auth.middleware";
export const cameraRoute = new Hono()

cameraRoute.use("*", authMiddleware);
cameraRoute.post('/add', addCamera)
cameraRoute.get('/list', getCamera)
cameraRoute.patch('/update', updateCamera)
cameraRoute.delete('/delete', deleteCamera)
// cameraRoute.get('/login', userLogin)
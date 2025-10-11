import {Hono} from "hono"
import { userLogin, userSignIn, userVerify } from "../controllers/auth.contollers"
import { authMiddleware } from "../middlewares/auth.middleware"
export const authRoute = new Hono()

authRoute.post('/signin', userSignIn)
authRoute.get('/login', userLogin)
authRoute.get('/verify',authMiddleware, userVerify)

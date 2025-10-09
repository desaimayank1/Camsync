import {Hono} from "hono"
import { userLogin, userSignIn } from "../controllers/auth.contollers"
export const authRoute = new Hono()

authRoute.post('/signin', userSignIn)
authRoute.get('/login', userLogin)

import { verify } from 'hono/jwt'
import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'

const JWT_SECRET = process.env.JWT_SECRET as string || "myJWTsecretKey"

export const authMiddleware = async (c: Context, next: Next) => {
    try {

        const token = getCookie(c, 'token')
        const user = await verify(token as string, JWT_SECRET)
        c.set("userId", user);
        console.log("user valid")
        await next();

    } catch (error) {
        console.error(error)
        return c.json({ error: 'Unauthorized: Invalid token' }, 401)
    }
}

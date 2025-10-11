import { verify } from 'hono/jwt'
import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'

const JWT_SECRET = process.env.JWT_SECRET as string || "myJWTsecretKey"

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        const token = getCookie(c, 'token')
        if (!token) {
            console.log('No token found in cookies')
            return c.json({ error: 'Unauthorized: No token provided' }, 401)
        }
        const user = await verify(token as string, JWT_SECRET)
        c.set("user", user);
        console.log("user valid")
        await next();

    } catch (error) {
        console.error(error)
        return c.json({ error: 'Unauthorized: Invalid token' }, 401)
    }
}

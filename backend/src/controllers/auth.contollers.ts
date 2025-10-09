import { Context } from "hono"
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from "@prisma/client"
import dotenv from "dotenv"
import { setCookie } from 'hono/cookie'
import bcrypt from 'bcrypt'
dotenv.config();

const prisma = new PrismaClient()

const JWT_SECRET = process.env.JWT_SECRET as string || "myJWTsecretKey"

export const userSignIn = async (c: Context) => {
    const { email, password } = c.req.queries()

    try {
        const existingUser = await prisma.user.findUnique({ where: { email: email[0] } })

        if (existingUser) {
            const valid = await bcrypt.compare(password[0], existingUser.password)
            if (!valid) return c.json({ error: 'User already exist and invalid password' }, 401)

            const token = await sign({ id: existingUser.id, email: existingUser.email }, JWT_SECRET)

            setCookie(c, 'token', token, {
                httpOnly: true,
                path: '/',
                maxAge: 3600,
                sameSite: 'none',
                secure: process.env.NODE_ENV === 'production',
            })

            return c.json({
                success: true,
                email: existingUser.email,
                id: existingUser.id,
                message: "User Already Exist"
            })

        }

        const hasdedPasword = await bcrypt.hash(password[0], 10);
        const user = await prisma.user.create({
            data: {
                email: email[0],
                password: hasdedPasword,
            }
        })

        const payload = {
            id: user.id,
            email: user.email,
        }
        const token = await sign(payload, JWT_SECRET);

        setCookie(c, 'token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 3600,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
        })

        return c.json({
            success: true,
            email: user.email,
            id: user.id,
            message: "User Created"
        })
    } catch (error) {
        return c.json({ success: false, message: 'Internal Server Error SignIn' }, 500)
    }
}


export const userLogin = async (c: Context) => {
    const { email, password } = c.req.queries()

    try {
        const user = await prisma.user.findUnique({ where: { email: email[0] } })
        if (!user) {
            return c.json({ success: false, message: "Invalid Credentials" });
        }

        const valid = await bcrypt.compare(password[0], user.password)
        if (!valid) {
            return c.json({ success: false, message: "Invalid Password" })
        }

        const payload = {
            id: user.id,
            email: user.email,
        }
        const token = await sign(payload, JWT_SECRET);

        setCookie(c, 'token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 3600,
            sameSite: 'none',
            secure: process.env.NODE_ENV === 'production',
        })

        return c.json({
            success: true,
            email: user.email,
            id: user.id,
            message: "User Logged In"
        })

    } catch (error) {
        return c.json({ success: false, message: 'Internal Server Error LogIn' }, 500)
    }
}
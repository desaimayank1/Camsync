import { Context } from "hono"

export const Camera = async (c: Context) => {
   return c.json({message:"Validated Camera"})
}
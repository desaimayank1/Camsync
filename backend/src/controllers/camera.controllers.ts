import { Context } from "hono"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const addCamera = async (c: Context) => {
   const { cameraName, rtspUrl, location } = await c.req.json();
   try {
      const userinfo = c.get('user')
      const existingCamera = await prisma.camera.findUnique({
         where: { rtspUrl: rtspUrl }
      });

      if (existingCamera) {
         return c.json({ success: false, message: 'A camera with this RTSP URL already exists.' });
      }

      const camera = await prisma.camera.create({
         data: {
            name: cameraName,
            rtspUrl: rtspUrl,
            location: location,
            user: {
               connect: {
                  id: userinfo.id,
               }
            }
         }
      })
      const newCamera = {
         id: camera.id,
         name: camera.name,
         location: camera.location,
         enabled: camera.enabled,
         faceDetection: camera.faceDetection,
         fps: camera.fps,
         rtspUrl: camera.rtspUrl
      }
      return c.json({ success: true, camera: newCamera, message: 'Camera added successfully' })

   } catch (error) {
      return c.json({ success: false, message: 'Internal Server Error NewCamera' }, 500)
   }
}


export const getCamera = async (c: Context) => {
   try {
      const userinfo = c.get('user')

      const cameras = await prisma.camera.findMany({
         where: {
            userId: userinfo.id,
         },
         select: {
            id: true,
            name: true,
            location: true,
            enabled: true,
            faceDetection: true,
            fps: true,
            rtspUrl: true,
         }
      })

      return c.json({ success: true, cameras: cameras, message: 'Camera added successfully' })

   } catch (error) {
      return c.json({ success: false, message: 'Internal Server Error getCamera' }, 500)
   }
}



export const updateCamera = async (c: Context) => {
   const { name, location, faceDetection, id } = await c.req.json();
   try {
      const userinfo = c.get('user')

      const camera = await prisma.camera.findUnique({
         where: {
            id: id
         }
      })

      if (camera?.faceDetection != faceDetection) {
         // worker logic 
      }

      const newcamera = await prisma.camera.update({
         where: {
            id: id
         },
         data: {
            name: name,
            location: location,
            faceDetection: faceDetection,
         }
      })
      console.log("updated", newcamera)

      return c.json({ success: true, message: 'Camera updated successfully' })

   } catch (error) {
      return c.json({ success: false, message: 'Internal Server Error UpdatedCamera' }, 500)
   }
}



export const deleteCamera = async (c: Context) => {
   const id = c.req.query('id');
   try {
      const camera = await prisma.camera.findUnique({
         where: {
            id: Number(id)
         }
      })

      if (camera?.enabled != true) {
         // worker logic 
      }

      await prisma.camera.delete({
         where: {
            id: Number(id),
         },
      })
      return c.json({ success: true, message: 'Camera deleted successfully' })

   } catch (error) {
      return c.json({ success: false, message: 'Internal Server Error DeleteCamera' }, 500)
   }
}
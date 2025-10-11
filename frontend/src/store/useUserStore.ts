import {create} from "zustand"
import type { Camera, User } from "../types/data-types"
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

interface UserStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchUser: () => Promise<void>;
}



type CameraStore = {
  cameras: Camera[]
  fetchCameras: () => Promise<void>;
  updateCamera: (updatedCamera: Camera) => void
  removeCamera: (cameraId: number) => void
  addCamera: (camera: Camera) => void
}

export const useCameraStore = create<CameraStore>((set) => ({
  cameras: [{
    id: 1,
    name: "Front Gate",
    location: "Main Entrance",
    enabled: true,
    faceDetection: true,
    fps: 15,
    rtspUrl: "rtsp://192.168.1.10:554/stream1"
  },
  {
    id: 2,
    name: "Warehouse Backdoor",
    location: "Rear Loading Area",
    enabled: false,
    faceDetection: false,
    fps: 10,
    rtspUrl: "rtsp://192.168.1.20:554/stream2"
  }],

  fetchCameras: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/camera/list`, {
        withCredentials: true,
      });
      const data = response.data;
      console.log(data.cameras)
      if (data.success) {
        set({ cameras: data.cameras});
      } else {
        set({ cameras: []});
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      set({ cameras: [] });
    }
  },

  updateCamera: (updatedCamera) =>
    set((state) => ({
      cameras: state.cameras.map((cam) =>
        cam.id === updatedCamera.id ? updatedCamera : cam
      ),
    })),

  removeCamera: (cameraId) =>
    set((state) => ({
      cameras: state.cameras.filter((cam) => cam.id !== cameraId),
    })),

  addCamera: (camera) =>
    set((state) => ({
      cameras: [...state.cameras, camera],
    })),
}))


export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  fetchUser: async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/verify`, {
        withCredentials: true,
      });
      const data = response.data;

      if (data.success) {
        set({ user: data.user, isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error("Auth verification failed:", error);
      set({ user: null, isLoading: false });
    }
  },
}));
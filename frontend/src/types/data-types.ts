export interface User {
    email: string,
    id: number,
    camera?: any
}

export interface Camera  {
  id: number
  name: string
  location?: string
  enabled: boolean
  faceDetection: boolean
  fps?: number
  rtspUrl?: string
}
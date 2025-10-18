from fastapi import FastAPI, File, UploadFile
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI(title="Face Detection Service")

# Load YOLOv8 face detection model (downloaded automatically if missing)
model = YOLO("yolov8n-face.pt")

@app.get('/')
async def server():
    return {"message":"Server running on port 5000"}

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    # Read uploaded image
    image_bytes = await file.read()
    np_img = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)

    # Run inference
    results = model(img, verbose=False)

    # Collect bounding boxes
    boxes = []
    for r in results[0].boxes.xyxy.tolist():
        x1, y1, x2, y2 = map(int, r[:4])
        boxes.append({"x": x1, "y": y1, "w": x2 - x1, "h": y2 - y1})

    return {"faces": boxes}

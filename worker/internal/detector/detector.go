package detector

import (
	"bytes"
	"encoding/json"
	"image"
	"image/color"
	"mime/multipart"
	"net/http"

	"gocv.io/x/gocv"
)

type Face struct {
	X, Y, W, H int
}

// DetectFacesMat sends a gocv.Mat frame to detection API and returns detected faces
func DetectFacesMat(img gocv.Mat) ([]Face, error) {
	buf, _ := gocv.IMEncode(".jpg", img)

	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, _ := writer.CreateFormFile("file", "frame.jpg")
	part.Write(buf.GetBytes())
	writer.Close()

	req, _ := http.NewRequest("POST", "http://localhost:5000/detect", body)
	req.Header.Set("Content-Type", writer.FormDataContentType())

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var result struct {
		Faces []Face `json:"faces"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, err
	}
	return result.Faces, nil
}

func DrawOverlayOnMat(img *gocv.Mat, faces []Face) {
	red := color.RGBA{255, 0, 0, 0}
	for _, f := range faces {
		gocv.Rectangle(img, image.Rect(f.X, f.Y, f.X+f.W, f.Y+f.H), red, 2)
	}
}

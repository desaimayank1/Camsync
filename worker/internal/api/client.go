package api

import (
	"bytes"
	"camsync/worker/internal/config"
	"camsync/worker/internal/detector"
	"encoding/json"
	"net/http"
	"time"

	"gocv.io/x/gocv"
)

func SendAlert(cameraID int, faces []detector.Face, img gocv.Mat) {
	cfg := config.Load()
	// Convert img to JPEG/base64 (placeholder)
	payload := map[string]interface{}{
		"camera_id": cameraID,
		"faces":     faces,
		"timestamp": time.Now(),
	}
	b, _ := json.Marshal(payload)
	http.Post(cfg.BackendURL+"/api/alerts", "application/json", bytes.NewReader(b))
}

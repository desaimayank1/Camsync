package worker

import (
	"camsync/worker/internal/detector"
	"fmt"
	"image"
	"os"
	"os/exec"
	"sync"
	"time"

	"gocv.io/x/gocv"
)

type CameraWorker struct {
	ID          int
	Cam         string
	URL         string
	User        string
	active      bool
	detectFaces bool
	stopCh      chan struct{}
	lastFaces   []detector.Face
	faceDecay   int
	mu          sync.Mutex
}

func NewCameraWorker(id int, cam, url, user string) *CameraWorker {
	return &CameraWorker{
		ID:          id,
		Cam:         cam,
		URL:         url,
		User:        user,
		stopCh:      make(chan struct{}),
		detectFaces: true,
		lastFaces:   []detector.Face{},
		faceDecay:   3,
	}
}

func (cw *CameraWorker) Start() {
	fmt.Printf("Camera %s - for user %s started\n", cw.Cam, cw.User)
	cw.active = true

	// Open source camera
	webcam, err := gocv.OpenVideoCapture(cw.URL)
	if err != nil {
		fmt.Println("Cannot open camera:", err)
		return
	}
	defer webcam.Close()

	img := gocv.NewMat()
	defer img.Close()

	// Read one frame to get resolution
	if ok := webcam.Read(&img); !ok || img.Empty() {
		fmt.Println("Cannot read from camera")
		return
	}
	width := img.Cols()
	height := img.Rows()

	// Build RTSP push URL for MediaMTX
	rtspURL := fmt.Sprintf("rtsp://admin:admin123@localhost:8554/%s/%s", cw.User, cw.Cam)

	// FFmpeg command to push H264 stream
	cmd := exec.Command("ffmpeg",
		"-f", "rawvideo",
		"-pix_fmt", "bgr24",
		"-s", fmt.Sprintf("%dx%d", width, height),
		"-r", "30",
		"-i", "-",
		"-c:v", "libx264",
		"-profile:v", "baseline",
		"-pix_fmt", "yuv420p",
		"-preset", "ultrafast",
		"-tune", "zerolatency",
		"-rtsp_transport", "tcp",
		"-f", "rtsp",
		rtspURL,
	)

	ffmpegIn, err := cmd.StdinPipe()
	if err != nil {
		fmt.Println("Failed to get ffmpeg stdin:", err)
		return
	}
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Start(); err != nil {
		fmt.Println("Failed to start ffmpeg:", err)
		return
	}
	defer cmd.Process.Kill()

	// Face detection goroutine with decay
	go func() {
		decayCounter := 0
		for cw.active {
			if !cw.detectFaces {
				time.Sleep(100 * time.Millisecond)
				continue
			}

			if !img.Empty() {
				small := gocv.NewMat()
				gocv.Resize(img, &small, image.Point{X: 320, Y: 240}, 0, 0, gocv.InterpolationLinear)
				faces, err := detector.DetectFacesMat(small)
				small.Close()

				cw.mu.Lock()
				if err == nil && len(faces) > 0 {
					scaleX := float64(img.Cols()) / 320
					scaleY := float64(img.Rows()) / 240
					for i := range faces {
						faces[i].X = int(float64(faces[i].X) * scaleX)
						faces[i].Y = int(float64(faces[i].Y) * scaleY)
						faces[i].W = int(float64(faces[i].W) * scaleX)
						faces[i].H = int(float64(faces[i].H) * scaleY)
					}
					cw.lastFaces = faces
					decayCounter = cw.faceDecay
				} else if decayCounter > 0 {
					decayCounter--
				} else {
					cw.lastFaces = nil
				}
				cw.mu.Unlock()
			}
			time.Sleep(200 * time.Millisecond)
		}
	}()

	// Main streaming loop
	for cw.active {
		if ok := webcam.Read(&img); !ok || img.Empty() {
			time.Sleep(time.Millisecond * 10)
			continue
		}

		cw.mu.Lock()
		faces := cw.lastFaces
		cw.mu.Unlock()
		if cw.detectFaces && len(faces) > 0 {
			detector.DrawOverlayOnMat(&img, faces)
		}

		// Write raw frame to FFmpeg stdin
		if img.IsContinuous() {
			_, err := ffmpegIn.Write(img.ToBytes())
			if err != nil {
				fmt.Println("FFmpeg write error:", err)
				break
			}
		} else {
			data, _ := img.DataPtrUint8()
			_, err := ffmpegIn.Write(data)
			if err != nil {
				fmt.Println("FFmpeg write error:", err)
				break
			}
		}
	}

	ffmpegIn.Close()
	cmd.Wait()
}

func (cw *CameraWorker) Stop() {
	if !cw.active {
		return
	}
	cw.active = false
	close(cw.stopCh)
}

func (cw *CameraWorker) Status() string {
	if cw.active {
		return "RUNNING"
	}
	return "STOPPED"
}

func (cw *CameraWorker) SetDetection(enabled bool) {
	cw.detectFaces = enabled
}

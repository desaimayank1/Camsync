package manager

import (
	"camsync/worker/internal/worker"
	"fmt"
	"sync"
)

type Manager struct {
	mu      sync.Mutex
	cameras map[int]*worker.CameraWorker
}

func New() *Manager {
	return &Manager{cameras: make(map[int]*worker.CameraWorker)}
}

func (m *Manager) StartCamera(id int, cam, url, user string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if cw, ok := m.cameras[id]; ok {
		fmt.Println("camera already there")
		go cw.Start()
		return
	}
	cw := worker.NewCameraWorker(id, cam, url, user)
	m.cameras[id] = cw
	go cw.Start()
}

func (m *Manager) StopCamera(id int) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if cw, ok := m.cameras[id]; ok {
		cw.Stop()
	}
}

func (m *Manager) DeleteCamera(id int) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if cw, ok := m.cameras[id]; ok {
		cw.Stop()
		delete(m.cameras, id)
	}
}

func (m *Manager) ToggleDetection(id int, enabled bool) {
	m.mu.Lock()
	defer m.mu.Unlock()
	if cw, ok := m.cameras[id]; ok {
		cw.SetDetection(enabled)
	}
}

func (m *Manager) Status() map[int]string {
	m.mu.Lock()
	defer m.mu.Unlock()
	out := map[int]string{}
	for id, cw := range m.cameras {
		out[id] = cw.Status()
	}
	return out
}

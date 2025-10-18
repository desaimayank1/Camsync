package main

import (
	"camsync/worker/internal/manager"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	// cfg := config.Load()
	mgr := manager.New()
	r := gin.Default()

	r.POST("/start", func(c *gin.Context) {
		var req struct {
			ID   int    `json:"id"`
			Cam  string `json:"cam"`
			URL  string `json:"url"`
			User string `json:"user"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		fmt.Println("start camera test", req)
		mgr.StartCamera(req.ID, req.Cam, req.URL, req.User)
		c.JSON(200, gin.H{"status": "started"})
	})

	r.POST("/stop", func(c *gin.Context) {
		var req struct {
			ID int `json:"id"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		mgr.StopCamera(req.ID)
		c.JSON(200, gin.H{"status": "stopped"})
	})

	r.POST("/delete", func(c *gin.Context) {
		var req struct {
			ID int `json:"id"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		mgr.DeleteCamera(req.ID)
		c.JSON(200, gin.H{"status": "deleted"})
	})

	r.POST("/toggle-detection", func(c *gin.Context) {
		var req struct {
			ID      int  `json:"id"`
			Enabled bool `json:"enabled"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		mgr.ToggleDetection(req.ID, req.Enabled)
		c.JSON(200, gin.H{"status": "toggled"})
	})

	r.GET("/status", func(c *gin.Context) { c.JSON(200, mgr.Status()) })

	log.Fatal(r.Run())
}

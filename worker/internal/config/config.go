package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	BackendURL string
	// AlertToken string
}

func Load() Config {
	err := godotenv.Load() // loads .env automatically
	if err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	return Config{
		BackendURL: os.Getenv("BACKEND_URL"),
		// AlertToken: os.Getenv("ALERT_TOKEN"),
	}
}

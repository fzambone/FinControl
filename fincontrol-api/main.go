package main

import (
	"fmt"
	"github.com/gofiber/fiber/v2"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB
var err error

func main() {
	dsn := "user:password@tcp(db:3306)/fincontrol?charset=utf8mb4&parseTime=true&loc=Local"
	_, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to database!!")
	}

	fmt.Println("DB Connected")

	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, FinControl with Fiber Server!")
	})

	app.Listen(":8080")
}

package main

import (
	"github.com/fzambone/FinControl/fincontrol-api/controllers"
	"github.com/fzambone/FinControl/fincontrol-api/database"
	"github.com/fzambone/FinControl/fincontrol-api/repositories"
	"github.com/fzambone/FinControl/fincontrol-api/services"
	"github.com/gofiber/fiber/v2"
)

func main() {
	//dbUser := os.Getenv("MYSQL_USER")
	//dbPass := os.Getenv("MYSQL_PASSWORD")
	//dbName := os.Getenv("MYSQL_DATABASE")
	//dbHost := os.Getenv("DB_HOST")
	//dbPort := os.Getenv("DB_PORT")

	//dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort, dbName)

	//_, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	//if err != nil {
	//	panic("Failed to connect to database")
	//}

	//fmt.Println("Connected to Database!")

	app := fiber.New()

	database.Connect()
	database.SetupDatabase()

	categoryRepo := repositories.NewCategoryRepository()
	categoryService := services.NewCategoryService(categoryRepo)
	categoryController := controllers.NewCategoryController(categoryService)

	setupRoutes(app, categoryController)

	app.Listen(":8080")
}

func setupRoutes(app *fiber.App, categoryController *controllers.CategoryController) {
	app.Post("/categories", categoryController.CreateCategory)
	app.Get("/categories", categoryController.GetAllCategories)
	app.Get("/categories/:id", categoryController.GetCategoryByID)
	app.Put("/categories/:id", categoryController.UpdateCategory)
	app.Delete("/categories/:id", categoryController.DeleteCategory)
	app.Get("/categoriesDeleted", categoryController.GetAllDeletedCategories)
	app.Put("/restoreCategory/:id", categoryController.RestoreCategory)
}

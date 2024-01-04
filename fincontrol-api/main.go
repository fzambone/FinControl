package main

import (
	"github.com/fzambone/FinControl/fincontrol-api/controllers"
	"github.com/fzambone/FinControl/fincontrol-api/database"
	"github.com/fzambone/FinControl/fincontrol-api/repositories"
	"github.com/fzambone/FinControl/fincontrol-api/services"
	"github.com/gofiber/fiber/v2"
)

func main() {

	app := fiber.New()

	database.Connect()
	database.SetupDatabase()

	categoryRepo := repositories.NewCategoryRepository()
	categoryService := services.NewCategoryService(categoryRepo)
	categoryController := controllers.NewCategoryController(categoryService)

	transactionRepo := repositories.NewTransactionRepository()
	transactionService := services.NewTransactionService(transactionRepo)
	transactionController := controllers.NewTransactionController(transactionService)

	setupRoutes(app, categoryController, transactionController)

	app.Listen(":8080")
}

func setupRoutes(app *fiber.App, categoryController *controllers.CategoryController, transactionController *controllers.TransactionController) {
	app.Post("/categories", categoryController.CreateCategory)
	app.Get("/categories", categoryController.GetAllCategories)
	app.Get("/categories/deleted", categoryController.GetAllDeletedCategories)
	app.Get("/categories/:id", categoryController.GetCategoryByID)
	app.Put("/categories/:id", categoryController.UpdateCategory)
	app.Delete("/categories/:id", categoryController.DeleteCategory)
	app.Patch("/categories/:id/restore", categoryController.RestoreCategory)

	app.Post("/transactions", transactionController.CreateTransaction)
	app.Get("/transactions", transactionController.GetAllTransactions)
	app.Get("/transactions/deleted", transactionController.GetAllDeletedTransactions)
	app.Get("/transactions/:id", transactionController.GetTransactionByID)
	app.Put("/transactions/:id", transactionController.UpdateTransaction)
	app.Delete("/transactions/:id", transactionController.DeleteTransaction)
	app.Patch("/transactions/:id/restore", transactionController.RestoreTransaction)
}

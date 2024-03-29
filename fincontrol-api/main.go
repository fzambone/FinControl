package main

import (
	"github.com/fzambone/FinControl/fincontrol-api/controllers"
	"github.com/fzambone/FinControl/fincontrol-api/database"
	"github.com/fzambone/FinControl/fincontrol-api/repositories"
	"github.com/fzambone/FinControl/fincontrol-api/services"
	"github.com/fzambone/FinControl/fincontrol-api/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins: "http://localhost:3000",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, HEAD, PUT, DELETE, PATCH",
	}))

	database.Connect()
	database.SetupDatabase()

	paymentMethodRepo := repositories.NewPaymentMethodRepository()
	paymentMethodService := services.NewPaymentMethodService(paymentMethodRepo)
	paymentMethodController := controllers.NewPaymentMethodController(paymentMethodService)

	categoryRepo := repositories.NewCategoryRepository()
	categoryService := services.NewCategoryService(categoryRepo)
	categoryController := controllers.NewCategoryController(categoryService)

	transactionRepo := repositories.NewTransactionRepository()
	transactionService := services.NewTransactionService(transactionRepo)
	transactionController := controllers.NewTransactionController(transactionService)

	parser := utils.NewExcelTransactionParser()
	fileUploadService := services.NewFileUploadService(transactionRepo, parser)
	fileUploadController := controllers.NewFileUploadController(fileUploadService)

	setupRoutes(app, categoryController, transactionController, paymentMethodController, fileUploadController)

	app.Listen(":8080")
}

func setupRoutes(app *fiber.App, categoryController *controllers.CategoryController, transactionController *controllers.TransactionController, paymentMethodController *controllers.PaymentMethodController, fileUploadController *controllers.FileUploadController) {
	app.Post("/paymentMethods", paymentMethodController.CreatePaymentMethod)
	app.Get("/paymentMethods", paymentMethodController.GetAllPaymentMethods)
	app.Get("/paymentMethods/deleted", paymentMethodController.GetAllDeletedPaymentMethods)
	app.Get("/paymentMethods/:id", paymentMethodController.GetPaymentMethodByID)
	app.Put("/paymentMethods/:id", paymentMethodController.UpdatePaymentMethod)
	app.Delete("/paymentMethods/:id", paymentMethodController.DeletePaymentMethod)
	app.Patch("/paymentMethods/:id/restore", paymentMethodController.RestorePaymentMethod)

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
	app.Post("/transactions/upload", fileUploadController.UploadFile)
}

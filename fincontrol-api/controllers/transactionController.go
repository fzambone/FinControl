package controllers

import (
	"errors"
	"github.com/fzambone/FinControl/fincontrol-api/models"
	"github.com/fzambone/FinControl/fincontrol-api/services"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
	"time"
)

type TransactionController struct {
	service services.TransactionService
}

func NewTransactionController(service services.TransactionService) *TransactionController {
	return &TransactionController{service: service}
}

func (c *TransactionController) CreateTransaction(ctx *fiber.Ctx) error {
	transaction := new(models.Transaction)

	if err := ctx.BodyParser(transaction); err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	err := c.service.CreateTransaction(transaction)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	createdTransaction, err := c.service.GetTransactionByID(transaction.ID)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusCreated).JSON(createdTransaction)
}

func (c *TransactionController) GetAllTransactions(ctx *fiber.Ctx) error {
	var (
		startDate, endDate *time.Time
		err                error
	)

	if start := ctx.Query("start_date"); start != "" {
		sd, err := time.Parse("2006-01-02", start)
		if err != nil {
			return ctx.Status(fiber.StatusBadRequest).SendString("Invalid start date format")
		}
		startDate = &sd
	}
	if end := ctx.Query("end_date"); end != "" {
		ed, err := time.Parse("2006-01-02", end)
		if err != nil {
			return ctx.Status(fiber.StatusBadRequest).SendString("Invalid end date format")
		}
		endDate = &ed
	}

	transactions, err := c.service.GetAllTransactions(startDate, endDate)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	var transactionResponses []models.TransactionResponse
	for _, t := range transactions {
		transactionResponse := models.ToTransactionResponse(t)
		transactionResponses = append(transactionResponses, transactionResponse)
	}

	return ctx.Status(fiber.StatusOK).JSON(transactionResponses)
}

func (c *TransactionController) GetTransactionByID(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	transaction, err := c.service.GetTransactionByID(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.Status(fiber.StatusNotFound).SendString("Transaction not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return ctx.Status(fiber.StatusOK).JSON(transaction)
}

func (c *TransactionController) UpdateTransaction(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	transaction := new(models.Transaction)
	if err := ctx.BodyParser(transaction); err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString(err.Error())
	}
	transaction.ID = uint(id)
	if err := c.service.UpdateTransaction(transaction); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(transaction)
}

func (c *TransactionController) DeleteTransaction(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	if err := c.service.DeleteTransaction(uint(id)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).SendString("Transaction deleted successfully")
}

func (c *TransactionController) GetAllDeletedTransactions(ctx *fiber.Ctx) error {
	transactions, err := c.service.GetAllDeletedTransactions()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(transactions)
}

func (c *TransactionController) RestoreTransaction(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	err = c.service.RestoreTransaction(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.Status(fiber.StatusNotFound).SendString("Deleted Transaction not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).SendString("Transaction restored successfully")
}

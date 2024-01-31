package controllers

import (
	"errors"
	"github.com/fzambone/FinControl/fincontrol-api/models"
	"github.com/fzambone/FinControl/fincontrol-api/services"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type PaymentMethodController struct {
	service services.PaymentMethodService
}

func NewPaymentMethodController(service services.PaymentMethodService) *PaymentMethodController {
	return &PaymentMethodController{service: service}
}

func (c *PaymentMethodController) CreatePaymentMethod(ctx *fiber.Ctx) error {
	paymentMethod := new(models.PaymentMethod)

	if err := ctx.BodyParser(paymentMethod); err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	err := c.service.CreatePaymentMethod(paymentMethod)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusCreated).JSON(paymentMethod)
}

func (c *PaymentMethodController) GetAllPaymentMethods(ctx *fiber.Ctx) error {
	paymentMethods, err := c.service.GetAllPaymentMethods()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(paymentMethods)
}

func (c *PaymentMethodController) GetPaymentMethodByID(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	paymentMethod, err := c.service.GetPaymentMethodByID(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.Status(fiber.StatusNotFound).SendString("Payment method not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return ctx.Status(fiber.StatusOK).JSON(paymentMethod)
}

func (c *PaymentMethodController) UpdatePaymentMethod(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	paymentMethod := new(models.PaymentMethod)
	if err := ctx.BodyParser(paymentMethod); err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	paymentMethod.ID = uint(id)
	if err := c.service.UpdatePaymentMethod(paymentMethod); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(paymentMethod)
}

func (c *PaymentMethodController) DeletePaymentMethod(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	if err := c.service.DeletePaymentMethod(uint(id)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).SendString("Payment Method deleted successfully")
}

func (c *PaymentMethodController) GetAllDeletedPaymentMethods(ctx *fiber.Ctx) error {
	paymentMethods, err := c.service.GetAllDeletedPaymentMethods()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(paymentMethods)
}

func (c *PaymentMethodController) RestorePaymentMethod(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	err = c.service.RestorePaymentMethod(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.Status(fiber.StatusNotFound).SendString("Deleted payment method not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).SendString("Payment Method restored successfully")
}

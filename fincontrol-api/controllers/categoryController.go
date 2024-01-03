package controllers

import (
	"errors"
	"github.com/fzambone/FinControl/fincontrol-api/models"
	"github.com/fzambone/FinControl/fincontrol-api/services"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

type CategoryController struct {
	service services.CategoryService
}

func NewCategoryController(service services.CategoryService) *CategoryController {
	return &CategoryController{service: service}
}

func (c *CategoryController) CreateCategory(ctx *fiber.Ctx) error {
	category := new(models.Category)

	if err := ctx.BodyParser(category); err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	err := c.service.CreateCategory(category)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusCreated).JSON(category)
}

func (c *CategoryController) GetAllCategories(ctx *fiber.Ctx) error {
	categories, err := c.service.GetAllCategories()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(categories)
}

func (c *CategoryController) GetCategoryByID(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	category, err := c.service.GetCategoryByID(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.Status(fiber.StatusNotFound).SendString("Category not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return ctx.Status(fiber.StatusOK).JSON(category)
}

func (c *CategoryController) UpdateCategory(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	category := new(models.Category)
	if err := ctx.BodyParser(category); err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	category.ID = uint(id)
	if err := c.service.UpdateCategory(category); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(category)
}

func (c *CategoryController) DeleteCategory(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	if err := c.service.DeleteCategory(uint(id)); err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.SendStatus(fiber.StatusNoContent)
}

func (c *CategoryController) GetAllDeletedCategories(ctx *fiber.Ctx) error {
	categories, err := c.service.GetAllDeletedCategories()
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(categories)
}

func (c *CategoryController) RestoreCategory(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString("Invalid ID")
	}

	category, err := c.service.RestoreCategory(uint(id))
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return ctx.Status(fiber.StatusNotFound).SendString("Deleted category not found")
		}
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).JSON(category)
}

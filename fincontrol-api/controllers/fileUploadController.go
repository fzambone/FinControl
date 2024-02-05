package controllers

import (
	"github.com/fzambone/FinControl/fincontrol-api/services"
	"github.com/gofiber/fiber/v2"
)

type FileUploadController struct {
	service *services.FileUploadService
}

func NewFileUploadController(s *services.FileUploadService) *FileUploadController {
	return &FileUploadController{service: s}
}

func (c *FileUploadController) UploadFile(ctx *fiber.Ctx) error {
	file, err := ctx.FormFile("file")
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).SendString(err.Error())
	}
	templateId := ctx.FormValue("templateId")
	referenceDate := ctx.FormValue("referenceDate")

	err = c.service.ProcessFileUpload(file, templateId, referenceDate)
	if err != nil {
		return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return ctx.Status(fiber.StatusOK).SendString("File uploaded successfully")
}

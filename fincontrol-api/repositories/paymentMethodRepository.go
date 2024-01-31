package repositories

import (
	"github.com/fzambone/FinControl/fincontrol-api/database"
	"github.com/fzambone/FinControl/fincontrol-api/models"
)

type PaymentMethodRepository interface {
	CreatePaymentMethod(paymentMethod *models.PaymentMethod) error
	GetAllPaymentMethods() ([]models.PaymentMethod, error)
	GetPaymentMethodByID(id uint) (models.PaymentMethod, error)
	UpdatePaymentMethod(paymentMethod *models.PaymentMethod) error
	DeletePaymentMethod(id uint) error
	GetAllDeletedPaymentMethods() ([]models.PaymentMethod, error)
	RestorePaymentMethod(id uint) error
}

type paymentMethodRepository struct{}

func NewPaymentMethodRepository() PaymentMethodRepository {
	return &paymentMethodRepository{}
}

func (repo *paymentMethodRepository) CreatePaymentMethod(paymentMethod *models.PaymentMethod) error {
	result := database.DB.Create(&paymentMethod)
	return result.Error
}

func (repo *paymentMethodRepository) GetAllPaymentMethods() ([]models.PaymentMethod, error) {
	var paymentMethods []models.PaymentMethod
	result := database.DB.Find(&paymentMethods)
	return paymentMethods, result.Error
}

func (repo *paymentMethodRepository) GetPaymentMethodByID(id uint) (models.PaymentMethod, error) {
	var paymentMethod models.PaymentMethod
	result := database.DB.First(&paymentMethod, id)
	return paymentMethod, result.Error
}

func (repo *paymentMethodRepository) UpdatePaymentMethod(paymentMethod *models.PaymentMethod) error {
	result := database.DB.Updates(&paymentMethod)
	return result.Error
}

func (repo *paymentMethodRepository) DeletePaymentMethod(id uint) error {
	result := database.DB.Where("id = ?", id).Delete(&models.PaymentMethod{})
	return result.Error
}

func (repo *paymentMethodRepository) GetAllDeletedPaymentMethods() ([]models.PaymentMethod, error) {
	var paymentMethods []models.PaymentMethod
	result := database.DB.Unscoped().Where("deleted_at IS NOT NULL").Find(&paymentMethods)
	return paymentMethods, result.Error
}

func (repo *paymentMethodRepository) RestorePaymentMethod(id uint) error {
	var paymentMethod models.PaymentMethod
	result := database.DB.Unscoped().Where("id = ? AND deleted_at IS NOT NULL", id).First(&paymentMethod)
	result = database.DB.Model(&paymentMethod).Unscoped().Update("deleted_at", nil)
	return result.Error
}

package services

import (
	"github.com/fzambone/FinControl/fincontrol-api/models"
	"github.com/fzambone/FinControl/fincontrol-api/repositories"
)

type PaymentMethodService interface {
	CreatePaymentMethod(paymentMethod *models.PaymentMethod) error
	GetAllPaymentMethods() ([]models.PaymentMethod, error)
	GetPaymentMethodByID(id uint) (models.PaymentMethod, error)
	UpdatePaymentMethod(paymentMethod *models.PaymentMethod) error
	DeletePaymentMethod(id uint) error
	GetAllDeletedPaymentMethods() ([]models.PaymentMethod, error)
	RestorePaymentMethod(id uint) error
}

type paymentMethodService struct {
	repo repositories.PaymentMethodRepository
}

func NewPaymentMethodService(repo repositories.PaymentMethodRepository) PaymentMethodService {
	return &paymentMethodService{repo: repo}
}

func (s *paymentMethodService) CreatePaymentMethod(paymentMethod *models.PaymentMethod) error {
	return s.repo.CreatePaymentMethod(paymentMethod)
}

func (s *paymentMethodService) GetAllPaymentMethods() ([]models.PaymentMethod, error) {
	return s.repo.GetAllPaymentMethods()
}

func (s *paymentMethodService) GetPaymentMethodByID(id uint) (models.PaymentMethod, error) {
	return s.repo.GetPaymentMethodByID(id)
}

func (s *paymentMethodService) UpdatePaymentMethod(paymentMethod *models.PaymentMethod) error {
	return s.repo.UpdatePaymentMethod(paymentMethod)
}

func (s *paymentMethodService) DeletePaymentMethod(id uint) error {
	return s.repo.DeletePaymentMethod(id)
}

func (s *paymentMethodService) GetAllDeletedPaymentMethods() ([]models.PaymentMethod, error) {
	return s.repo.GetAllDeletedPaymentMethods()
}

func (s *paymentMethodService) RestorePaymentMethod(id uint) error {
	return s.repo.RestorePaymentMethod(id)
}

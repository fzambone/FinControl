package services

import (
	"github.com/fzambone/FinControl/fincontrol-api/models"
	"github.com/fzambone/FinControl/fincontrol-api/repositories"
	"time"
)

type TransactionService interface {
	CreateTransaction(transaction *models.Transaction) error
	GetAllTransactions(startDate, endDate *time.Time) ([]models.Transaction, error)
	GetTransactionByID(id uint) (models.Transaction, error)
	UpdateTransaction(transaction *models.Transaction) error
	DeleteTransaction(id uint) error
	GetAllDeletedTransactions() ([]models.Transaction, error)
	RestoreTransaction(id uint) error
}

type transactionService struct {
	repo repositories.TransactionRepository
}

func NewTransactionService(repo repositories.TransactionRepository) TransactionService {
	return &transactionService{repo: repo}
}

func (s *transactionService) CreateTransaction(transaction *models.Transaction) error {
	return s.repo.CreateTransaction(transaction)
}

func (s *transactionService) GetAllTransactions(startDate, endDate *time.Time) ([]models.Transaction, error) {
	return s.repo.GetAllTransactions(startDate, endDate)
}

func (s *transactionService) GetTransactionByID(id uint) (models.Transaction, error) {
	return s.repo.GetTransactionByID(id)
}

func (s *transactionService) UpdateTransaction(transaction *models.Transaction) error {
	return s.repo.UpdateTransaction(transaction)
}

func (s *transactionService) DeleteTransaction(id uint) error {
	return s.repo.DeleteTransaction(id)
}

func (s *transactionService) GetAllDeletedTransactions() ([]models.Transaction, error) {
	return s.repo.GetAllDeletedTransactions()
}

func (s *transactionService) RestoreTransaction(id uint) error {
	return s.repo.RestoreTransaction(id)
}

package repositories

import (
	"github.com/fzambone/FinControl/fincontrol-api/database"
	"github.com/fzambone/FinControl/fincontrol-api/models"
	"time"
)

type TransactionRepository interface {
	CreateTransaction(transaction *models.Transaction) error
	GetAllTransactions(startDate, endDate *time.Time) ([]models.Transaction, error)
	GetTransactionByID(id uint) (models.Transaction, error)
	UpdateTransaction(transaction *models.Transaction) error
	DeleteTransaction(id uint) error
	GetAllDeletedTransactions() ([]models.Transaction, error)
	RestoreTransaction(id uint) error
}
type transactionRepository struct{}

func NewTransactionRepository() TransactionRepository { return &transactionRepository{} }

func (repo *transactionRepository) CreateTransaction(transaction *models.Transaction) error {
	result := database.DB.Create(&transaction)
	return result.Error
}

func (repo *transactionRepository) GetAllTransactions(startDate, endDate *time.Time) ([]models.Transaction, error) {
	var transactions []models.Transaction
	query := database.DB
	if startDate != nil && endDate != nil {
		query = query.Where("payment_date >= ? AND payment_date <= ?", startDate, endDate)
	}
	result := query.Preload("Category").Find(&transactions)
	return transactions, result.Error
}

func (repo *transactionRepository) GetTransactionByID(id uint) (models.Transaction, error) {
	var transaction models.Transaction
	result := database.DB.Preload("Category").First(&transaction, id)
	return transaction, result.Error
}

func (repo *transactionRepository) UpdateTransaction(transaction *models.Transaction) error {
	result := database.DB.Updates(&transaction)
	return result.Error
}

func (repo *transactionRepository) DeleteTransaction(id uint) error {
	result := database.DB.Where("id = ?", id).Delete(&models.Transaction{})
	return result.Error
}

func (repo *transactionRepository) GetAllDeletedTransactions() ([]models.Transaction, error) {
	var transactions []models.Transaction
	result := database.DB.Unscoped().Where("deleted_at IS NOT NULL").Find(&transactions)
	return transactions, result.Error
}

func (repo *transactionRepository) RestoreTransaction(id uint) error {
	var transaction models.Transaction
	result := database.DB.Unscoped().Where("id = ? AND deleted_at IS NOT NULL", id).First(&transaction)
	result = database.DB.Model(&transaction).Unscoped().Update("deleted_at", nil)
	return result.Error
}

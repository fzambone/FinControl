package models

import (
	"gorm.io/gorm"
	"time"
)

type Transaction struct {
	gorm.Model
	CategoryID      uint          `gorm:"index;not null"`
	Category        Category      `gorm:"foreignKey:CategoryID"`
	PaymentMethodID uint          `gorm:"index;not null"`
	PaymentMethod   PaymentMethod `gorm:"foreignKey:PaymentMethodID"`
	Amount          float64
	Name            string
	Description     string
	Type            string
	PaymentDate     time.Time
}

type TransactionResponse struct {
	ID              uint      `json:"ID"`
	CategoryID      uint      `json:"CategoryID"`
	PaymentMethodID uint      `json:"PaymentMethodID"`
	Amount          float64   `json:"Amount"`
	Name            string    `json:"Name"`
	Description     string    `json:"Description"`
	Type            string    `json:"Type"`
	PaymentDate     time.Time `json:"PaymentDate"`
}

func ToTransactionResponse(t Transaction) TransactionResponse {
	return TransactionResponse{
		ID:              t.ID,
		CategoryID:      t.CategoryID,
		PaymentMethodID: t.PaymentMethodID,
		Amount:          t.Amount,
		Name:            t.Name,
		Description:     t.Description,
		Type:            t.Type,
		PaymentDate:     t.PaymentDate,
	}
}

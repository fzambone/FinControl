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
	ReferenceDate   string
	NeedsReview     bool
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
	ReferenceDate   string    `json:"ReferenceDate"`
	NeedsReview     bool      `json:"NeedsReview"`
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
		ReferenceDate:   t.ReferenceDate,
		NeedsReview:     t.NeedsReview,
	}
}

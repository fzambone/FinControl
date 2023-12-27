package models

import (
	"gorm.io/gorm"
	"time"
)

type Transaction struct {
	gorm.Model
	UserID      uint
	CategoryID  uint
	Amount      float64
	Name        string
	Description string
	Type        string
	accountID   uint
	PaymentDate time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

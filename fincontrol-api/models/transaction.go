package models

import (
	"gorm.io/gorm"
	"time"
)

type Transaction struct {
	gorm.Model
	CategoryID  uint     `gorm:"index;not null"`
	Category    Category `gorm:"foreignKey:CategoryID"`
	Amount      float64
	Name        string
	Description string
	Type        string
	PaymentDate time.Time
	//CreatedAt   time.Time      `gorm:"default:CURRENT_TIMESTAMP(3)"`
	//UpdatedAt   time.Time      `gorm:"default:CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)"`
	//DeletedAt   gorm.DeletedAt `gorm:"index;"`
}

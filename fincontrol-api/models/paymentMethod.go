package models

import (
	"gorm.io/gorm"
)

type PaymentMethod struct {
	gorm.Model
	Name string `json:"Name" gorm:"type:varchar(100);uniqueIndex"`
}

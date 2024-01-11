package models

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name string `json:"Name" gorm:"type:varchar(100);uniqueIndex"`
}

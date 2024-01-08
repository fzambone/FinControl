package models

import (
	"gorm.io/gorm"
)

type Category struct {
	gorm.Model
	Name string `json:"name" gorm:"type:varchar(100);uniqueIndex"`
	//CreatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP(3)"`
	//UpdatedAt time.Time      `gorm:"default:CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)"`
	//DeletedAt gorm.DeletedAt `gorm:"index;"`
}

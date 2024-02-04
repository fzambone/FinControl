package database

import (
	"errors"
	"fmt"
	"github.com/fzambone/FinControl/fincontrol-api/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"os"
)

var DB *gorm.DB

func Connect() {
	var err error

	dsn := getDSN()
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	log.Println("Database Connected")
}

func getDSN() string {
	dbUser := os.Getenv("MYSQL_USER")
	dbPass := os.Getenv("MYSQL_PASSWORD")
	dbName := os.Getenv("MYSQL_DATABASE")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")

	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", dbUser, dbPass, dbHost, dbPort, dbName)
}

func SetupDatabase() {
	tx := DB.Begin()

	var defaultPaymentMethod models.PaymentMethod
	if err := tx.First(&defaultPaymentMethod, 1).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			defaultPaymentMethod = models.PaymentMethod{
				Name: "Default",
			}
			if err := tx.Create(&defaultPaymentMethod).Error; err != nil {
				tx.Rollback()
				log.Fatalf("Failed to create default payment method: %v", err)
				return
			}
		} else {
			tx.Rollback()
			log.Fatalf("Failed to check default payment method: %v", err)
			return
		}
	}

	if err := tx.Exec("UPDATE transactions SET payment_method_id = ? WHERE payment_method_id IS NULL", defaultPaymentMethod.ID).Error; err != nil {
		tx.Rollback()
		log.Fatalf("Failed to update transactions: %v", err)
		return
	}

	if err := tx.AutoMigrate(&models.Category{}, &models.Transaction{}, &models.PaymentMethod{}); err != nil {
		tx.Rollback()
		log.Fatalf("Failed to migrate database: %v", err)
		return
	}

	tx.Commit()
	log.Println("Database migration completed")
}

package repositories

import (
	"github.com/fzambone/FinControl/fincontrol-api/database"
	"github.com/fzambone/FinControl/fincontrol-api/models"
)

type CategoryRepository interface {
	CreateCategory(category *models.Category) error
	GetAllCategories() ([]models.Category, error)
	GetCategoryByID(id uint) (models.Category, error)
	UpdateCategory(category *models.Category) error
	DeleteCategory(id uint) error
	GetAllDeletedCategories() ([]models.Category, error)
	RestoreCategory(id uint) error
}

type categoryRepository struct{}

func NewCategoryRepository() CategoryRepository {
	return &categoryRepository{}
}

func (repo *categoryRepository) CreateCategory(category *models.Category) error {
	result := database.DB.Create(&category)
	return result.Error
}

func (repo *categoryRepository) GetAllCategories() ([]models.Category, error) {
	var categories []models.Category
	result := database.DB.Find(&categories)
	return categories, result.Error
}

func (repo *categoryRepository) GetCategoryByID(id uint) (models.Category, error) {
	var category models.Category
	result := database.DB.First(&category, id)
	return category, result.Error
}

func (repo *categoryRepository) UpdateCategory(category *models.Category) error {
	result := database.DB.Updates(&category)
	return result.Error
}

func (repo *categoryRepository) DeleteCategory(id uint) error {
	result := database.DB.Where("id = ?", id).Delete(&models.Category{})
	return result.Error
}

func (repo *categoryRepository) GetAllDeletedCategories() ([]models.Category, error) {
	var categories []models.Category
	result := database.DB.Unscoped().Where("deleted_at IS NOT NULL").Find(&categories)
	return categories, result.Error
}

func (repo *categoryRepository) RestoreCategory(id uint) error {
	var category models.Category
	result := database.DB.Unscoped().Where("id = ? AND deleted_at IS NOT NULL", id).First(&category)
	result = database.DB.Model(&category).Unscoped().Update("deleted_at", nil)
	return result.Error
}

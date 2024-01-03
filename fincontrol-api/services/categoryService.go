package services

import (
	"github.com/fzambone/FinControl/fincontrol-api/models"
	"github.com/fzambone/FinControl/fincontrol-api/repositories"
)

type CategoryService interface {
	CreateCategory(category *models.Category) error
	GetAllCategories() ([]models.Category, error)
	GetCategoryByID(id uint) (models.Category, error)
	UpdateCategory(category *models.Category) error
	DeleteCategory(id uint) error
	GetAllDeletedCategories() ([]models.Category, error)
	RestoreCategory(id uint) (models.Category, error)
}

type categoryService struct {
	repo repositories.CategoryRepository
}

func NewCategoryService(repo repositories.CategoryRepository) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) CreateCategory(category *models.Category) error {
	return s.repo.CreateCategory(category)
}

func (s *categoryService) GetAllCategories() ([]models.Category, error) {
	return s.repo.GetAllCategories()
}

func (s *categoryService) GetCategoryByID(id uint) (models.Category, error) {
	return s.repo.GetCategoryByID(id)
}

func (s *categoryService) UpdateCategory(category *models.Category) error {
	return s.repo.UpdateCategory(category)
}

func (s *categoryService) DeleteCategory(id uint) error {
	return s.repo.DeleteCategory(id)
}

func (s *categoryService) GetAllDeletedCategories() ([]models.Category, error) {
	return s.repo.GetAllDeletedCategories()
}

func (s *categoryService) RestoreCategory(id uint) (models.Category, error) {
	return s.repo.RestoreCategory(id)
}

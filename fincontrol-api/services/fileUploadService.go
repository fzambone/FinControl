package services

import (
	"errors"
	"github.com/fzambone/FinControl/fincontrol-api/models"
	"github.com/fzambone/FinControl/fincontrol-api/repositories"
	"github.com/fzambone/FinControl/fincontrol-api/utils"
	"mime/multipart"
	"time"
)

type FileUploadService struct {
	transactionRepo repositories.TransactionRepository
	parser          utils.FileParser
}

func NewFileUploadService(repo repositories.TransactionRepository, parser utils.FileParser) *FileUploadService {
	return &FileUploadService{
		transactionRepo: repo,
		parser:          parser,
	}
}

// TODO: Verify duplicates
func (s *FileUploadService) ProcessFileUpload(file *multipart.FileHeader, templateId string, referenceDate string) error {
	if referenceDate == "" {
		return errors.New("referenceDate cannot be empty")
	}

	transactions, err := s.parser.ParseItauCCFile(file, templateId)
	if err != nil {
		return err
	}

	var paymentMethodID uint
	if templateId == "ItauCC" {
		paymentMethodID = 1
	} else {
		paymentMethodID = determinePaymentMethodIDBasedOnTemplate(templateId)
	}

	for _, parsedTransaction := range transactions {
		paymentDate, err := time.Parse("02/01/2006", parsedTransaction.PaymentDate)
		if err != nil {
			return err
		}

		dbTransaction := models.Transaction{
			Amount:          parsedTransaction.Amount,
			Name:            parsedTransaction.Name,
			Type:            string(parsedTransaction.Type),
			PaymentDate:     paymentDate,
			CategoryID:      999,
			PaymentMethodID: paymentMethodID,
			Description:     "Parsed from automatic file upload",
			ReferenceDate:   referenceDate,
			NeedsReview:     true,
		}

		err = s.transactionRepo.CreateTransaction(&dbTransaction)
		if err != nil {
			return err
		}
	}

	return nil
}

func determinePaymentMethodIDBasedOnTemplate(templateId string) uint {
	//TODO: Implement logic to determine PaymentMethodID based on templateID
	// switch templateId {
	// case "Template 2":
	//		return 2
	// default:
	// 		return 0
	// }
	return 0
}

package utils

import (
	"errors"
	"fmt"
	"github.com/xuri/excelize/v2"
	"math"
	"mime/multipart"
	"strconv"
	"strings"
)

type TransactionType string

const (
	Expense      TransactionType = "Expense"
	Cancellation TransactionType = "Cancellation"
)

type Transaction struct {
	PaymentDate string
	Name        string
	Amount      float64
	Type        TransactionType
}

type FileParser interface {
	ParseItauCCFile(file *multipart.FileHeader, templateId string) ([]Transaction, error)
	ValidateFile(file *multipart.FileHeader, templateId string) error
}

type ExcelTransactionParser struct{}

func NewExcelTransactionParser() *ExcelTransactionParser {
	return &ExcelTransactionParser{}
}

func (p *ExcelTransactionParser) ValidateFile(file *multipart.FileHeader, templateId string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	f, err := excelize.OpenReader(src)
	if err != nil {
		return err
	}

	sheets := f.GetSheetList()
	var hasExpectedSheet bool
	if templateId == "ItauCC" {
		expectedSheetName := "Lançamentos"
		for _, sheet := range sheets {
			if sheet == expectedSheetName {
				hasExpectedSheet = true
				break
			}
		}
	}

	if !hasExpectedSheet {
		return errors.New("file structure does not match the expected template")
	}
	return nil
}

// TODO: Implement grand total validation
func (p *ExcelTransactionParser) ParseItauCCFile(file *multipart.FileHeader, templateId string) ([]Transaction, error) {
	if err := p.ValidateFile(file, templateId); err != nil {
		return nil, err
	}

	src, err := file.Open()
	if err != nil {
		return nil, fmt.Errorf("error opening file: %w", err)
	}
	defer src.Close()

	f, err := excelize.OpenReader(src)
	if err != nil {
		return nil, fmt.Errorf("error reading file: %w", err)
	}

	var transactions []Transaction
	var parseErrors []error
	rows, err := f.GetRows("Lançamentos")
	if err != nil {
		return nil, fmt.Errorf("error getting rows from sheet: %w", err)
	}

	inTransactionSection := false

	for i, row := range rows {
		if len(row) >= 4 && isHeaderRow(row) {
			inTransactionSection = true
			continue
		}

		if inTransactionSection && len(row) >= 4 {
			if strings.Contains(strings.ToLower(row[1]), "dólar de conversão") ||
				strings.Contains(strings.ToLower(row[1]), "united states") {
				continue
			}

			amount, err := parseAmount(row[3])
			if err != nil {
				parseErrors = append(parseErrors, fmt.Errorf("row %d: %w", i+1, err))
				continue
			}

			transactionType := determineType(amount)
			if transactionType == Cancellation {
				amount = math.Abs(amount)
			}

			transactions = append(transactions, Transaction{
				PaymentDate: strings.TrimSpace(row[0]),
				Name:        strings.TrimSpace(row[1]),
				Amount:      amount,
				Type:        transactionType,
			})
		} else if inTransactionSection {
			inTransactionSection = false
		}
	}

	if len(parseErrors) > 0 {
		return nil, combineErrors(parseErrors)
	}

	return transactions, nil
}

func isHeaderRow(row []string) bool {
	return strings.Contains(strings.ToLower(row[0]), "data") &&
		strings.Contains(strings.ToLower(row[1]), "lançamento") &&
		strings.Contains(strings.ToLower(row[3]), "valor")
}

func parseAmount(amountStr string) (float64, error) {
	cleanAmountStr := strings.TrimSpace(amountStr)
	//cleanAmountStr = strings.Replace(cleanAmountStr, "$", "", -1)
	cleanAmountStr = strings.Replace(cleanAmountStr, "R$ ", "", -1)
	cleanAmountStr = strings.Replace(cleanAmountStr, ",", "", -1)
	cleanAmountStr = strings.Replace(cleanAmountStr, "- ", "-", -1)

	amount, err := strconv.ParseFloat(cleanAmountStr, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid value '%s': %v", amountStr, err)
	}
	return amount, nil
}

func determineType(amount float64) TransactionType {
	if amount < 0 {
		return Cancellation
	}
	return Expense
}

func combineErrors(errors []error) error {
	errorStrings := make([]string, len(errors))
	for i, err := range errors {
		errorStrings[i] = err.Error()
	}
	return fmt.Errorf("multiple parse errors: %s", strings.Join(errorStrings, "; "))
}

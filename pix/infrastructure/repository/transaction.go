package repository

import (
	"fmt"

	"github.com/jinzhu/gorm"
	"github.com/mellomaths/pix/domain/model"
)

type TransactionRepositoryDb struct {
	Db *gorm.DB
}

func (repository *TransactionRepositoryDb) RegisterTransaction(transaction *model.Transaction) error {
	err := repository.Db.Create(transaction).Error
	if err != nil {
		return err
	}
	return nil
}

func (repository *TransactionRepositoryDb) SaveTransaction(transaction *model.Transaction) error {
	err := repository.Db.Save(transaction).Error
	if err != nil {
		return err
	}
	return nil
}

func (repository *TransactionRepositoryDb) FindTransaction(id string) (*model.Transaction, error) {
	var transaction model.Transaction
	repository.Db.Preload("AccountFrom.Bank").First(&transaction, "id = ?", id)

	if transaction.ID == "" {
		return nil, fmt.Errorf("no key was found")
	}
	return &transaction, nil
}

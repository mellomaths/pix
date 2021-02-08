package usecase

import (
	"log"

	"github.com/mellomaths/pix/domain/model"
)

type TransactionUseCase struct {
	TransactionRepository model.TransactionRepositoryInterface
	PixKeyRepository      model.PixKeyRepositoryInterface
}

func (t *TransactionUseCase) RegisterTransaction(accountId string, amount float64, pixKeyTo string, pixKeyKindTo string, description string) (*model.Transaction, error) {
	account, err := t.PixKeyRepository.FindAccount(accountId)
	if err != nil {
		return nil, err
	}

	pixKey, err := t.PixKeyRepository.FindKeyByKind(pixKeyTo, pixKeyKindTo)
	if err != nil {
		return nil, err
	}

	transaction, err := model.NewTransaction(account, amount, pixKey, description)
	if err != nil {
		return nil, err
	}

	err = t.TransactionRepository.SaveTransaction(transaction)
	if err != nil {
		return nil, err
	}

	return transaction, nil
}

func (t *TransactionUseCase) ConfirmTransaction(transactionId string) (*model.Transaction, error) {
	transaction, err := t.TransactionRepository.FindTransaction(transactionId)
	if err != nil {
		log.Println("Transaction not found", transactionId)
		return nil, err
	}

	transaction.Confirm()
	err = t.TransactionRepository.SaveTransaction(transaction)
	if err != nil {
		return nil, err
	}

	return transaction, nil
}

func (t *TransactionUseCase) CompleteTransaction(transactionId string) (*model.Transaction, error) {
	transaction, err := t.TransactionRepository.FindTransaction(transactionId)
	if err != nil {
		log.Println("Transaction not found", transactionId)
		return nil, err
	}

	transaction.Complete()
	err = t.TransactionRepository.SaveTransaction(transaction)
	if err != nil {
		return nil, err
	}

	return transaction, nil
}

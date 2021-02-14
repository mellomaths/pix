package factory

import (
	"github.com/jinzhu/gorm"
	"github.com/mellomaths/pix/application/usecase"
	"github.com/mellomaths/pix/infrastructure/repository"
)

func TransactionUseCaseFactory(database *gorm.DB) usecase.TransactionUseCase {
	pixRepository := repository.PixKeyRepositoryDb{Db: database}
	transactionRepository := repository.TransactionRepositoryDb{Db: database}

	transactionUseCase := usecase.TransactionUseCase{
		TransactionRepository: &transactionRepository,
		PixKeyRepository:      pixRepository,
	}
	return transactionUseCase
}

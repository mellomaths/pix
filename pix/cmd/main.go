package main

import (
	"os"

	"github.com/jinzhu/gorm"
	"github.com/mellomaths/pix/application/grpc"
	"github.com/mellomaths/pix/infrastructure/db"
)

var database *gorm.DB

func main() {
	database = db.ConnectDB(os.Getenv("env"))
	grpc.StartGrpcServer(database, 50051)
}

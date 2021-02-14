package kafka

import (
	"fmt"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

func NewKafkaProducer() *ckafka.Producer {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": "kafka:9092",
	}
	producer, err := ckafka.NewProducer(configMap)
	if err != nil {
		panic(err)
	}

	return producer
}

func Publish(msg string, topic string, producer *ckafka.Producer, deliveryChannel chan ckafka.Event) error {
	message := &ckafka.Message{
		TopicPartition: ckafka.TopicPartition{
			Topic:     &topic,
			Partition: ckafka.PartitionAny,
		},
		Value: []byte(msg), // converts string to slice of bytes
	}

	err := producer.Produce(message, deliveryChannel)
	if err != nil {
		return err
	}

	return nil
}

func DeliveryReport(deliveryChannel chan ckafka.Event) {
	for event := range deliveryChannel {
		switch eventType := event.(type) {
		case *ckafka.Message:
			if eventType.TopicPartition.Error != nil {
				fmt.Println("Delivery failed: ", eventType.TopicPartition)
			} else {
				fmt.Println("Delivery message to: ", eventType.TopicPartition)
			}

		}
	}
}

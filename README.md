# Pix

#### Description:
- Emulate transactions between banks and bank accounts based on specific keys like email, cpf or id.
- Each bank account can register a Pix key.
- If we have two differents bank accounts on the different banks, like A and B, the user of the bank account A can use the Pix key of the bank account B to transfer money from A to B.
- No transaction can be lost if Pix is not running.
- No transaction can be lost if the destination bank is not working.

## Functional requirements

### About banks

#### Requirements:
- A bank is a microservice that allows the user to create bank account and Pix keys, and also transfer.
- We can use the same application to emulate different banks, changing only colors, name and bank id (using Docker containers).
- Nest.js will be used on backend.
- Next.js, based on React, will be used on frontend.

### About Pix

#### Requirements:
- A microservice responsible to be in the middle, the center of all bank account transfer.
- Written in Go.
- Banks can search for Pix keys.
- Banks can register/create a new Pix key, if not already created.
- Transfer flow:
  - Receive request for transfer to bank B from bank A.
  - Save the transfer with status "pending".
  - Send the request for transfer to bank B.
  - Receive confirmation of the transfer from bank B.
  - Update status of the transfer to "confirmed".
  - Send the confirmation of the transfer from bank B back to bank A.
  - Receive the confirmation of the bank A.
  - Update status of the transfer to "completed". 
  
![Pix flow](/docs/pix.jpg "Pix flow")

### Challenges

- Fast and efficient communication.
- Pix creation and searches operations should be immediate (synchronous).
- The application should guarantee that no transaction would be lost, even if any of those 3 systems are not running. That means that the communication of transfer transactions should be asynchronous.


#### Definitions:
- For synchronous operations, we are going to use **gRPC**.
- For asynchronous operations, we are going to use **Apache Kafka**.

## Technical requirements

### About Pix

#### Requirements:
- Should be able to act as a gRPC server.
- Should consume/subscribe and publish messages with Apache Kafka.
- Those two operations, synchronous and asynchronous should work simultaneously.
- In order to be domain driven designed, it should have a "application layer" responsible to technical complexity (gRPC server and Kafka) and it should be flexible to be implemented others clients like API REST, CLI and others without changing the core domain or others components of the application.

#### Layers

- application: handles technical complexity.
  - factory: create new instances of objects that have a lot of dependencies.
  - grpc: server and others gRPC services
  - kafka: consumption and processing of the transaction on Kafka.
  - model: works like dto, objects that receives external requests (Kafka or gRPC.
  - usecases: executes the flow according to the business logic.
- cmd: CLI, with command registered to start the application.
- domain: heart of the application.
  - model: business rules.
- infrastructure: low level part of the application.
  - db: handles connection to databases, ORM configuration.
  - repository: persists all data and normally are called by "usecases".

#### Resources

- Docker.
- Golang.
- Apache Kafka.
- Postgres.

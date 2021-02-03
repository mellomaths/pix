# Pix

Requirements:
- Emulate transactions between banks and bank accounts based on specific keys like email, cpf or id.
- Each bank account can register a Pix key.
- If we have two differents bank accounts on the different banks, like A and B, the user of the bank account A can use the Pix key of the bank account B to transfer money from A to B.
- No transaction can be lost if Pix is not running.
- No transaction can be lost if the destination bank is not working.

## About banks

Requirements:
- A bank is a microservice that allows the user to create bank account and Pix keys, and also transfer.
- We can use the same application to emulate different banks, changing only colors, name and bank id (using Docker containers).
- Nest.js will be used on backend.
- Next.js, based on React, will be used on frontend.

## About Pix

Requirements:
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
  

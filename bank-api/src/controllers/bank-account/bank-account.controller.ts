import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from 'src/models/bank-account';
import { Repository } from 'typeorm';

@Controller('bank-accounts')
export class BankAccountController {

    constructor(
        @InjectRepository(BankAccount)
        private bankAccountRepository: Repository<BankAccount>,
    ) {

    }

    @Get()
    index() {
        return this.bankAccountRepository.find();
    }

    @Get(':bankAccountId')
    show(
        @Param('bankAccountId', new ParseUUIDPipe({ version: '4' })) bankAccountId: string
    ) {
        return this.bankAccountRepository.findOneOrFail(bankAccountId);
    }
}

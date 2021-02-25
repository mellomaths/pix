import { Body, Controller, Get, Inject, InternalServerErrorException, Param, ParseUUIDPipe, Post, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PixKeyDto } from 'src/dto/PixKeyDto';
import { BankAccount } from 'src/models/bank-account';
import { PixKey } from 'src/models/pix-key.model';
import { Repository } from 'typeorm';

import { PixService } from "src/grpc/types/pix-service.grpc";

@Controller('bank-accounts/:bankAccountId/pix-keys')
export class PixKeyController {

    constructor(
        @InjectRepository(PixKey)
        private pixKeyRepository: Repository<PixKey>,
        @InjectRepository(BankAccount)
        private bankAccountRepository: Repository<BankAccount>,
        @Inject('PIX_PACKAGE')
        private clientGrpc: ClientGrpc,
    ) {}

    @Get()
    index(
        @Param('bankAccountId', new ParseUUIDPipe({ version: '4' })) bankAccountId: string,
    ) {
        return this.pixKeyRepository.find({
            where: {
                bank_account_id: bankAccountId,
            },
            order: {
                created_at: 'DESC'
            }
        });
    }

    @Post()
    async store(
        @Param('bankAccountId', new ParseUUIDPipe({ version: '4' })) bankAccountId: string,
        @Body(new ValidationPipe({ errorHttpStatusCode: 422 })) body: PixKeyDto,
    ) {
        await this.bankAccountRepository.findOneOrFail(bankAccountId);

        const pixService: PixService = this.clientGrpc.getService('PixService');
        
        const notFound = await this.checkPixKeyNotFound(body);
        if (!notFound) {
            throw new UnprocessableEntityException("Pix Key already exists!");
        }

        const createdPixKey = await pixService.registerPixKey({
            ...body,
            accountId: bankAccountId,
        }).toPromise();

        if (createdPixKey.error) {
            throw new InternalServerErrorException(createdPixKey.error);
        }

        const pixKey = this.pixKeyRepository.create({
            id: createdPixKey.id,
            bank_account_id: bankAccountId,
            ...body,
        });

        return await this.pixKeyRepository.save(pixKey);
    }

    @Get('exists')
    exists() {}

    async checkPixKeyNotFound(params: { key: string, kind: string }) {
        const pixService: PixService = this.clientGrpc.getService('PixService');
        try {
            await pixService.find(params).toPromise();
            return false;
        } catch (error) {
            if (error.details === 'no key was found') {
                return true;
            }

            throw new InternalServerErrorException("Server not available");
        }
    }

}

import { Controller, Get, Post } from '@nestjs/common';

@Controller('pix-key')
export class PixKeyController {

    @Get()
    index() {}

    @Post()
    store() {}

    @Get('exists')
    exists() {}

}

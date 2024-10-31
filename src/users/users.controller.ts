import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get('')
    async listUsers(){
        return this.usersService.findAll();
    }
    
    @UseGuards(AuthGuard)
    @Get('/:email')
    async listUserByEmail(@Param() email:string){
        return this.usersService.findOne(email);
    }

    @UseGuards(AuthGuard)
    @Post('/create')
    async create(@Body() body) {
        return this.usersService.create(body);
    }
}

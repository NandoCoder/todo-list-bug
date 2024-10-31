import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

    async create(body: any) {
        const user = new User();
        user.email = body.email;
        user.pass = body.password;
        user.fullname = body.fullname;

        try
        {
            await this.usersRepository.save(user);

            return user;
        }
        catch(error)
        {
            throw new InternalServerErrorException('An error occurred while creating the user');
        }

    }

    async findOne(email: string) {
        try
        {
            const user = await this.usersRepository.findOneBy({
                email,
            });
    
            if(!user){
                throw new NotFoundException(`User with email ${email} not found`);
            }

            return user;

        }
        catch(error)
        {
            throw new InternalServerErrorException('An error occurred while searching for the user');
        }

    }

    async findAll() {
        try
        {
            const user = await this.usersRepository.find({relations: ['tasks'],});

            return user;

        }
        catch(error)
        {
            throw new InternalServerErrorException('An error occurred while fetching users');
        }

    }
}

import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly tasksRepository: Repository<Task>,
    ) {}

    async listTasks() {
        try 
        {
            const tasks = await this.tasksRepository.find({relations: ['owner'],});

            return tasks;

        } 
        catch (error) 
        {
            throw new InternalServerErrorException('An error occurred while fetching users');
        }

    }

    async getTask(id: string, userId: string) {
        try
        {
            const task = await this.tasksRepository
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.owner', 'owner')
                .where(`task.id = :id`, { id })
                .getOne();
    
            if (!task) {
                throw new NotFoundException('Task not found');
            }
    
            if (task.owner.id !== userId) {
                throw new ForbiddenException('You do not have permission to view this task');
            }
    
            return task;
        } 
        catch (error) 
        {
            throw new InternalServerErrorException('Failed to get task');
        }
    
    }

    async editTask(body: any, userId:string) {
        try
         {
            await this.getTask(body.id, userId);
    
            await this.tasksRepository.update(body.id, body);
    
            return await this.getTask(body.id, userId);
        } 
        catch (error) 
        {
            throw new InternalServerErrorException('An error occurred while fetching users');
        }

    }
}

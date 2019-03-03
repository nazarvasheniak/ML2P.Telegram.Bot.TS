import { Task } from '../models';

export default class TaskRepository {
    private database;

    constructor(database) {
        this.database = database;
    }

    async getAll(): Promise<Task[]> {
        let tasks: Task[] = await this.database.findAll();
        return tasks;
    }

    async getLast(): Promise<Task> {
        let task: Task = await this.database.findOne({
            order: [
                [ 'createdAt', 'DESC' ]
            ]
        });

        return task;
    }

    async add(task: Task): Promise<Task> {
        let newTask: Task = await this.database.build(task).save();
        return newTask;
    }

    async createFirst(): Promise<Task> {
        let firstTask: Task = await this.database.build({
            text: "Посетить Google",
            url: "http://google.com"
        }).save();

        return firstTask;
    }
}
import { Task } from '../models';
import TaskRepository from '../repositories/task.repository';

export default class TaskService {
    private taskRepository: TaskRepository;

    constructor(taskRepository: TaskRepository) {
        this.taskRepository = taskRepository;
    }

    async getAllTasks(): Promise<Task[]> {
        let tasks: Task[] = await this.taskRepository.getAll();
        return tasks;
    }

    async getLastTask(): Promise<Task> {
        let task: Task = await this.taskRepository.getLast();
        return task;
    }

    async createTask(task: Task): Promise<Task> {
        let newTask = await this.taskRepository.add(task);
        return newTask;
    }

    async createFirstTask(): Promise<Task> {
        let firstTask = await this.taskRepository.createFirst();
        return firstTask;
    }
}
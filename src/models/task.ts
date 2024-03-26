export interface Task {
    id: number;
    order: number;
    duration: number;
    name: string;
    description?: string;
}

export interface ITask {
    name: string;
    time: number;
}
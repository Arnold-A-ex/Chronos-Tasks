import { Container, Row } from "react-bootstrap";
import Task from "./Task";
import type { TaskItem } from "../types/index";

interface Props {
    tasks: TaskItem[];
    openEditTaskForm: (task: TaskItem) => void;
    deleteTask: (taskId: string) => Promise<void>;
}

export default function TodayTasks({ tasks, openEditTaskForm, deleteTask }: Props) {
    const today = new Date();
    // Normalize today's date to YYYY-MM-DD for comparison
    const todayFormatted = today.toISOString().split('T')[0];

    const todayTasks = tasks.filter(task =>
        task.dueDate === todayFormatted && !task.completed
    );

    const taskElements = todayTasks.map(task => (
        <Task key={task.id} task={task} openEditTaskForm={ openEditTaskForm } deleteTask={ deleteTask } />
    ));

    return (
        <Container className="home p-4">
            <h1 className="mb-4">Today's Activities</h1>
            <Row>
                {todayTasks.length > 0 ? (
                    taskElements
                ) : (
                    <p className="text-secondary">No tasks due today!</p>
                )}
            </Row>
        </Container>
    );
}
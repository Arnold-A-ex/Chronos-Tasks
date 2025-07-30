import { useParams } from "react-router-dom";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Task from "./Task";
import type { TaskItem } from "../types/index"; 

interface Props {
    tasks: TaskItem[];
    openAddTaskForm: () => void;
    openEditTaskForm: (task: TaskItem) => void;
    deleteTask: (taskId: string) => Promise<void>;
}

export default function CategoryTasks({ tasks, openEditTaskForm, openAddTaskForm, deleteTask }: Props) {
    const { categoryName } = useParams<{ categoryName: string }>();

    const filteredTasks = tasks.filter(task =>
        task.category === categoryName
    );

    const taskElements = filteredTasks.map(task => (
        <Task key={task.id} task={task} openEditTaskForm={ openEditTaskForm } deleteTask={ deleteTask } />
    ));

    return (
        <Container className="home p-4">
            <Row className="category-task align-items-center p-4 ">
                <Col xs={6}>
                    <h1 className="mb-4">{categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : ''} Tasks({filteredTasks.length}): </h1>
                </Col>
                <Col xs={6} className="add-task d-flex justify-content-end">
                    <Button className="btn-primary new-task" onClick={ openAddTaskForm }> <FaPlus />Add New Task</Button>
                </Col>
            </Row>
            <Row className="mt-3">
                {filteredTasks.length > 0 ? (
                    taskElements
                ) : (
                    <p className="text-secondary">No tasks in this category yet.</p>
                )}
            </Row>
        </Container>
    );
}
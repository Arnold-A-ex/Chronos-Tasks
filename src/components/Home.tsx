import Task from "./Task";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import type { TaskItem } from "../types/index";
import { Link } from "react-router-dom";

interface Props {
    tasks: TaskItem[];
    openAddTaskForm: () => void;
    openEditTaskForm: (task: TaskItem) => void;
    deleteTask: (taskId: string) => Promise<void>;
}

export default function Home({ tasks, openAddTaskForm, openEditTaskForm, deleteTask }: Props) {
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0]; // YYYY-MM-DD
    const tasksDueToday = tasks.filter(task =>
        task.dueDate === todayFormatted && !task.completed
    );

    const taskElement = tasks.map(task => {
        return (
            <Task key={task.id} task={task} openEditTaskForm={ openEditTaskForm } deleteTask={ deleteTask } />
        )
    })

    return (
        <Container className="home p-4">
            <Row className="add-task align-items-center p-4 ">
                <h2>Today's Task</h2>
                <p>Check your daily tasks and schedule</p>
                <Col xs={6}>
                    {/* Link to Today's Activities page */}
                    <Link to="/today-tasks">
                        <Button className="btn-secondary">
                            Today's Schedule ({tasksDueToday.length})
                        </Button>
                    </Link>
                </Col>
                <Col xs={6} className="add-task d-flex justify-content-end">
                    <Button className="btn-primary new-task" onClick={ openAddTaskForm }> <FaPlus /> New Task</Button>
                </Col>
            </Row>
            <hr className="fw-bold" />
            <div className="tasks ">
                <h2>All tasks</h2>
                {tasks.length > 0 ? taskElement : <p className="text-secondary">No tasks available. Add one!</p>}
            </div>
        </Container>
    )
}
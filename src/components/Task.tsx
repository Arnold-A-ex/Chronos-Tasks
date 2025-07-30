import { FaUserAlt, FaBuilding, FaAngleRight, FaDumbbell, FaCheckCircle, FaTimesCircle, FaSpinner, FaShoppingBag } from "react-icons/fa";
import { Button, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { TaskItem } from "../types/index";


interface Props {
    task: TaskItem;
    openEditTaskForm: (task: TaskItem) => void;
    deleteTask: (taskId: string) => Promise<void>;
}

export default function Task({ task, openEditTaskForm, deleteTask }: Props) {
    // Helper function to format ISO date strings for display
    const formatDateForDisplay = (isoString: string | undefined): string => {
        if (!isoString) return "";
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return isoString; // Return original string if parsing fails
        }
    };

    const isTaskDueToday = () => {
        if (!task.dueDate) return false;
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        return today.toDateString() === dueDate.toDateString();
    };

    const getTaskStatusClass = () => {
        if (task.completed) {
            return "task-status-completed";
        } else if (isTaskDueToday()) {
            return "task-status-due-today";
        }
        return "task-status-pending";
    };

    return (
        <Card className={`task-card p-4 mb-3 ${getTaskStatusClass()}`}>
            <Row className="align-items-center">
                <Col xs={2} sm={1} className="task-icon-col d-flex justify-content-center align-items-center">
                    <div className="task-category-icon">
                        {task.category === "personal" ? <FaUserAlt /> :
                         task.category === "workout" ? <FaDumbbell /> :
                         task.category === "work" ? <FaBuilding /> :
                         task.category === "shopping" ? <FaShoppingBag /> :
                         <FaAngleRight />
                        }
                    </div>
                </Col>

                {/* Task Details (Text, Category, Dates) */}
                <Col xs={10} sm={7} className="task-details-col">
                    <h3 className={`task-title fw-bold ${task.completed ? 'text-decoration-line-through' : ''}`}>
                        {task.text}
                    </h3>
                    <p className="task-meta mb-1">
                        <span className="task-category">{task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
                        {task.dueDate && (
                            <span className={`task-due-date ms-2 ${isTaskDueToday() && !task.completed ? 'fw-bold text-danger' : ''}`}>
                                Due: {formatDateForDisplay(task.dueDate)}
                            </span>
                        )}
                        <span className="task-created-at ms-2 text-secondary">
                            Created: {formatDateForDisplay(task.createdAt)}
                        </span>
                    </p>
                </Col>

                <Col xs={12} sm={4} className="task-actions-col d-flex flex-column flex-sm-row justify-content-end align-items-center mt-3 mt-sm-0 gap-2">
                    <div className={`task-completion-status d-flex align-items-center gap-1 ${task.completed ? 'text-success' : 'text-danger'}`}>
                        {task.completed === undefined || task.completed === null ? (
                            <FaSpinner className="text-secondary" title="Status Unknown" />
                        ) : task.completed ? (
                            <>
                                <FaCheckCircle /> <span className="d-none d-sm-inline">Completed</span>
                            </>
                        ) : (
                            <>
                                <FaTimesCircle /> <span className="d-none d-sm-inline">Pending</span>
                            </>
                        )}
                    </div>

                    <Link to={`/task/${task.id}`} className="btn btn-outline-primary btn-sm flex-grow-1 flex-sm-grow-0 d-flex align-items-center justify-content-center">
                        Details <FaAngleRight />
                    </Link>
                    <Button variant="primary" size="sm" onClick={() => openEditTaskForm(task)} className=" flex-sm-grow-0 d-flex justify-content-center">Edit</Button>
                    <Button variant="secondary" size="sm" onClick={() => deleteTask(task.id)} className=" flex-sm-grow-0 d-flex justify-content-center">Delete</Button>
                </Col>
            </Row>
        </Card>
    );
}
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaArrowLeft, FaEdit, FaUserAlt, FaDumbbell, FaBuilding, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import type { TaskItem } from "../types/index";

interface Props {
    tasks: TaskItem[];
    openEditTaskForm: (task: TaskItem) => void;
}

export default function TaskDetailPage({ tasks, openEditTaskForm }: Props) {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const task = tasks.find(t => t.id === taskId);

    const formatDateForDisplay = (isoString: string | undefined, includeWeekday: boolean = false): string => {
        if (!isoString) return "N/A";
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString("en-GB", {
                weekday: includeWeekday ? "long" : undefined,
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        } catch (e) {
            console.error("Error formatting date:", e);
            return isoString;
        }
    };

    if (!task) {
        return (
            <Container className="task-detail-page p-4 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <h1 className="text-danger mb-3">Task Not Found</h1>
                <p className="text-secondary mb-4">The task you are looking for does not exist.</p>
                <Button onClick={() => navigate(-1)} className="btn-primary">
                    <FaArrowLeft className="me-2" /> Go Back
                </Button>
            </Container>
        );
    }

    return (
        <Container className="task-detail-page p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <Button onClick={() => navigate(-1)} className="btn-secondary d-flex align-items-center gap-2">
                    <FaArrowLeft /> Back
                </Button>
                <Button className="btn-primary d-flex align-items-center gap-2" onClick={() => openEditTaskForm(task)}>
                    <FaEdit /> Edit Task
                </Button>
            </div>
            <Card className="detail-card p-4">
                <Row className="align-items-center mb-4 pb-3 border-bottom">
                    <Col xs="auto" className="detail-icon-col me-3">
                        <div className="detail-category-icon">
                            {task.category === "personal" ? <FaUserAlt /> :
                             task.category === "workout" ? <FaDumbbell /> :
                             task.category === "work" ? <FaBuilding /> :
                             <FaArrowLeft />
                            }
                        </div>
                    </Col>
                    <Col>
                        <h1 className="task-detail-title fw-bold mb-0">{task.text}</h1>
                        <p className="text-secondary detail-category-text mt-1">
                            Category: <span className="fw-bold text-primary">{task.category.charAt(0).toUpperCase() + task.category.slice(1)}</span>
                        </p>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col xs={12} md={6} className="mb-3 mb-md-0">
                        <h5 className="detail-label">Created On:</h5>
                        <p className="detail-value">{formatDateForDisplay(task.createdAt, true)}</p>
                    </Col>
                    <Col xs={12} md={6}>
                        <h5 className="detail-label">Due Date:</h5>
                        <p className={`detail-value ${task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString() && !task.completed ? 'text-danger fw-bold' : ''}`}>
                            {task.dueDate ? formatDateForDisplay(task.dueDate, true) : "No due date set"}
                        </p>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col>
                        <h5 className="detail-label">Status:</h5>
                        <p className={`detail-value fw-bold d-flex align-items-center gap-2 ${task.completed ? 'text-success' : 'text-danger'}`}>
                            {task.completed ? <FaCheckCircle /> : <FaTimesCircle />}
                            {task.completed ? "Completed" : "Pending"}
                        </p>
                    </Col>
                </Row>
                {task.description && (
                    <Row className="mt-4 pt-4 border-top">
                        <Col>
                            <h4 className="detail-label mb-3">Description:</h4>
                            <Card.Text className="detail-description lead">
                                {task.description}
                            </Card.Text>
                        </Col>
                    </Row>
                )}
            </Card>
        </Container>
    );
}
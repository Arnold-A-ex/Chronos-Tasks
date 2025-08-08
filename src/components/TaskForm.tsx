import React, { useState, useEffect } from 'react';
import { Button, Form, Offcanvas } from 'react-bootstrap';
import type { TaskItem } from '../types/index'; // Adjust path
import { FaTimes } from 'react-icons/fa'; // Close icon

interface TaskFormProps {
  show: boolean;
  onHide: () => void;
  onSubmit: (task: TaskItem) => void;
  taskToEdit?: TaskItem | null;
}

export default function TaskForm({ show, onHide, onSubmit, taskToEdit }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskItem>({
    id: "",
    text: '',
    description: '',
    category: 'personal',
    createdAt: new Date().toISOString().split('T')[0],
    dueDate: '',
    completed: false,
  });
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setError("");
    if (taskToEdit) {
      setFormData(taskToEdit);
    } else {
      setFormData({
        id: "",
        text: '',
        description: '',
        category: 'personal',
        createdAt: new Date().toISOString().split('T')[0],
        dueDate: '',
        completed: false,
      });
    }
  }, [taskToEdit, show]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    if (formData.text === "") {
        setError("Please input Task Name")
        return false;
    }else {
        setError("");
        return true;
    };
  }

  const handleSubmit = (e: React.FormEvent) => {
    setError("");
    e.preventDefault();
    if(validate()){
        onSubmit(formData);
        onHide();
    } else return;
  };

  return (
    <Offcanvas show={ show } onHide={ onHide } placement="end" className="task-form p-2">
        <Offcanvas.Header className="d-flex justify-content-between align-items-center">
            <Offcanvas.Title className="fw-bold">{ taskToEdit ? 'Edit Task' : 'Add New Task' }</Offcanvas.Title>
            <Button variant="link" className="text-decoration-none" onClick={ onHide }>
                <FaTimes className="text-secondary" />
            </Button>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <Form onSubmit={ handleSubmit } className="task-form">
                <Form.Group className="mb-3" controlId="task-title">
                    <Form.Label>Task Title</Form.Label>
                    <Form.Control
                        type="text"
                        name="text"
                        value={ formData.text }
                        onChange={ handleChange }
                        isInvalid={ !!error }
                        isValid={ formData.text.trim() && !error ? true : false }
                    />
                    <Form.Control.Feedback type="invalid">{ error }</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description (Optional)</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="description"
                        className="text-area"
                        value={ formData.description || '' }
                        onChange={ handleChange }
                        rows={3}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="category">
                    <Form.Label>Category</Form.Label>
                    <Form.Select name="category" value={ formData.category } onChange={ handleChange }>
                        <option value="personal">Personal</option>
                        <option value="workout">Workout</option>
                        <option value="work">Work</option>
                        <option value="shopping">Shopping</option>
                        <option value="other">Other</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="due-date">
                    <Form.Label>Due Date (Optional)</Form.Label>
                    <Form.Control
                        type="date"
                        name="dueDate"
                        value={ formData.dueDate || '' }
                        onChange={ handleChange }
                    />
                </Form.Group>

                {taskToEdit && (
                    <Form.Group className="mb-3" controlId="completed">
                    <Form.Check
                        type="checkbox"
                        label="Completed"
                        name="completed"
                        checked={ formData.completed || false }
                        onChange={ handleChange }
                    />
                    </Form.Group>
                )}

                <Button variant="primary" type="submit" className="w-100 mt-4 d-flex justify-content-center">
                    {taskToEdit ? 'Update Task' : 'Add Task'}
                </Button>
            </Form>
        </Offcanvas.Body>
    </Offcanvas>
  );
}
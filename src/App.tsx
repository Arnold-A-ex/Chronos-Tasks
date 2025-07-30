import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "./components/Layout";
import Home from "./components/Home.jsx";
import useLocalStorage from "./components/useLocalStorage";
import type { TaskItem } from "./types/index";
// import type { Dispatch, SetStateAction } from "react";
import TodayTasks from "./components/TodayTasks";
import CategoryTasks from "./components/CategoryTasks";
import TaskDetailPage from "./components/TaskDetail";
import TaskForm from "./components/TaskForm";
import Login from "./components/Login";
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut} from 'firebase/auth';
import type { User as FBUser } from "firebase/auth";
import {
    collection,
    query,
    // where,
    orderBy,
    onSnapshot, // For real-time updates
    addDoc,      // For adding new documents
    updateDoc,   // For updating documents
    doc,         // To get a reference to a specific document
    deleteDoc    // For deleting documents (optional, but good to have)
} from 'firebase/firestore';
import './App.css';


function App() {
    const [theme, setTheme] = useLocalStorage<string>("theme", "light");
    const [firebaseUser, setFirebaseUser] = useState<FBUser | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [tasks, setTasks] = useState<TaskItem[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(false);

    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<TaskItem | null>(null);

    const handleAddTask = async (newTask: TaskItem) => {
        if (!firebaseUser) {
            console.error("Cannot add task: User not logged in.");
            return;
        }
        try {
            // Add a new document to the 'tasks' subcollection for the current user
            const docRef = await addDoc(collection(db, `users/${firebaseUser.uid}/tasks`), {
                text: newTask.text,
                description: newTask.description || '',
                category: newTask.category,
                createdAt: newTask.createdAt || new Date().toISOString().split('T')[0],
                dueDate: newTask.dueDate || '',
                completed: newTask.completed || false,
            });
            console.log("Task added with ID: ", docRef.id);
            // The onSnapshot listener will automatically update the local 'tasks' state
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    };

    const handleUpdateTask = async (updatedTask: TaskItem) => {
        if (!firebaseUser) {
            console.error("Cannot update task: User not logged in.");
            return;
        }
        if (!updatedTask.id) {
            console.error("Cannot update task: Task ID is missing.");
            return;
        }
        try {
            // Get a reference to the specific document
            const taskDocRef = doc(db, `users/${firebaseUser.uid}/tasks`, updatedTask.id as string);
            // Update the document. Omit the id property from the object being sent
            await updateDoc(taskDocRef, {
                text: updatedTask.text,
                description: updatedTask.description || '',
                category: updatedTask.category,
                createdAt: updatedTask.createdAt, // Keep createdAt as is
                dueDate: updatedTask.dueDate || '',
                completed: updatedTask.completed,
            });
            console.log("Task updated successfully!");
            // The onSnapshot listener will automatically update the local 'tasks' state
        } catch (e) {
            console.error("Error updating document: ", e);
            // Handle error
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!firebaseUser) {
            console.error("Cannot delete task: User not logged in.");
            return;
        }
        try {
            await deleteDoc(doc(db, `users/${firebaseUser.uid}/tasks`, taskId));
            console.log("Task deleted successfully!");
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
    };

    const openAddTaskForm = () => {
        setTaskToEdit(null);
        setShowTaskForm(true);
    }

    const openEditTaskForm = (task: TaskItem) => {
        setTaskToEdit(task);
        setShowTaskForm(true);
    }

    const closeTaskForm = () => {
        setTaskToEdit(null);
        setShowTaskForm(false);
    }

    const changeTheme = () => {
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    }

    const extractUserName = (user: FBUser | null) => {
        if(!user) return "User";
        if( user.displayName) return user.displayName;
        if(user.email) return user.email.split("@")[0];

        return "User";

    }

    //FIREBASE AUTHENTICATION FUNCTIONS
    // Firebase Logout Function
    const handleLogout = async () => {
        try {
            await signOut(auth);
            setTasks([]);
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const handleLoginSuccess = (userEmail: string) => {
        // onAuthStateChanged listener will handle setting firebaseUser state
        console.log(`User ${userEmail} logged in successfully!`);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setFirebaseUser(user);
            setLoadingAuth(false); // Auth state has been determined

            if (user) {
                setLoadingTasks(true);
                const tasksCollectionRef = collection(db, `users/${user.uid}/tasks`);
                // Create a query to order tasks (e.g., by creation date)
                const q = query(tasksCollectionRef, orderBy('createdAt', 'desc'));

                // Set up real-time listener for tasks
                const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
                    const fetchedTasks: TaskItem[] = snapshot.docs.map(doc => ({
                        id: doc.id, // Use Firestore's document ID as task ID
                        ...(doc.data() as Omit<TaskItem, 'id'>) // Cast data to TaskItem, excluding 'id'
                    }));
                    setTasks(fetchedTasks);
                    setLoadingTasks(false);
                }, (error) => {
                    console.error("Error fetching tasks:", error);
                    setLoadingTasks(false);
                    // Handle errors (e.g., show a message to the user)
                });

                // Return unsubscribe function for Firestore listener
                return () => unsubscribeFirestore();

            } else {
                setTasks([]); // Clear tasks if no user is logged in
                setLoadingTasks(false);
            }
        });

        

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    if (loadingAuth || loadingTasks) {
        return (
            <div className="d-flex justify-content-center align-items-center auth-loader">
                <h3> { loadingAuth ? "Loading authentication..." : "Loading your tasks..." } </h3>
            </div>
        );
    }

    const router = createBrowserRouter(createRoutesFromElements(
        <Route path="/" element={ firebaseUser ? <Layout  changeTheme={ changeTheme } theme={ theme}  currentUser={ extractUserName(firebaseUser) } handleLogout={ handleLogout } /> : <Login onLoginSuccess={ handleLoginSuccess } /> } >
            { firebaseUser &&
                <>
                    <Route index element={ <Home tasks={ tasks } openEditTaskForm={ openEditTaskForm } deleteTask={ handleDeleteTask } openAddTaskForm={ openAddTaskForm }/>} />
                    <Route path="today-tasks" element={ <TodayTasks tasks={ tasks } openEditTaskForm={ openEditTaskForm } deleteTask={ handleDeleteTask } /> } />
                    <Route path="category/:categoryName" element={ <CategoryTasks tasks={ tasks } openAddTaskForm={ openAddTaskForm } openEditTaskForm={ openEditTaskForm } deleteTask={ handleDeleteTask } /> } />
                    <Route path="task/:taskId" element={ <TaskDetailPage tasks={ tasks } openEditTaskForm={ openEditTaskForm }/>}  />
                </>
            }
            { !firebaseUser && <Route path="*" element={ <Login onLoginSuccess={ handleLoginSuccess } /> } /> }
        </Route>
    ))

    return (
        <>
            <RouterProvider router={ router } />
            <TaskForm show={ showTaskForm } onHide={ closeTaskForm } onSubmit={ taskToEdit ? handleUpdateTask : handleAddTask } taskToEdit={ taskToEdit } />
        </>
    )
}

export default App

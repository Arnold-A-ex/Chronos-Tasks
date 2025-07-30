import React, { useState } from 'react';
import { Container, Form, Button, Card, Spinner, Alert, Modal } from 'react-bootstrap'; // Added Alert for error messages
import { auth } from '../firebase'; // Import the auth object
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// import type FireBaseError from "firebase/auth"; // Import Firebase auth functions

interface LoginProps {
  onLoginSuccess: (userEmail: string) => void;
}
type Error = {
    email?: string;
    password?: string;
    resetEmail?: string;
}

export default function Login({ onLoginSuccess }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [valueError, setValueError] = useState<Error>({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleSubmit = async (e: React.FormEvent) => {
        setValueError({});
        e.preventDefault();
        setError('');
        setLoading(true);

        if(email.trim() === ""){
            setValueError(prevError => ({ prevError, email: "Please input email"}));
            return;
        }else if(!emailRegex.test(email)){
            setValueError(prevError => ({ prevError, email: "Please input valid email"}));
            return;
        }else if( password.trim() === ""){
            setValueError(prevError => ({ prevError, password: "Please input password"}));
            return;
        }

        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
                alert('Registration successful! You can now log in.');
                setIsRegistering(false); // Switch back to login after registration
            } else {
                // console.log("signing in with email:", email, "and password:", password);
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                onLoginSuccess(userCredential.user.email || 'User'); // Pass email or default name
            }
        } catch (err: unknown) {
            if (err && typeof err === "object" && "code" in err) {
                switch (err.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        setError('Invalid email or password.');
                        break;
                    case 'auth/email-already-in-use':
                        setError('Email already in use. Try logging in or use a different email.');
                        break;
                    case 'auth/weak-password':
                        setError('Password should be at least 6 characters.');
                        break;
                    default:
                        if("message" in err) setError(`Authentication failed: ${err.message}`);
                }
            } else {
                setError('An unexpected error occurred during authentication.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setValueError({});
        setResetMessage('');
        setError('');
        setLoading(true);

        if(resetEmail.trim() === ""){
            setValueError(prevError => ({ prevError, resetEmail: "Please input email"}));
            return;
        }else if(!emailRegex.test(resetEmail)){
            setValueError(prevError => ({ prevError, resetEmail: "Please input valid email"}));
            return;
        }

        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMessage('Password reset email sent! Check your inbox.');
            setResetEmail(''); // Clear email field
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'code' in err) {
                switch (err.code) {
                    case 'auth/invalid-email':
                        setError('Please enter a valid email address.');
                        break;
                    case 'auth/user-not-found':
                        setError('No user found with that email. Please check the email address.');
                        break;
                    default:
                        if ("message" in err) setError(`Failed to send reset email: ${err.message}`);
                }
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

      // --- Google Sign-in Function ---
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        onLoginSuccess(userCredential.user.email || 'Google User');
    } catch (err: unknown) {
        if (err && typeof err === 'object' && 'code' in err) {
            switch (err.code) {
                case 'auth/popup-closed-by-user':
                    setError('Google sign-in popup closed. Please try again.');
                    break;
                case 'auth/cancelled-popup-request':
                    setError('Sign-in already in progress or popup blocked.');
                    break;
                case 'auth/account-exists-with-different-credential':
                    setError('An account with this email already exists with a different sign-in method. Please use that method or reset your password.');
                    break;
                case 'auth/operation-not-allowed':
                    setError('Google sign-in is not enabled in Firebase project settings.');
                    break;
                default:
                    if ("message" in err) setError(`Google sign-in failed: ${err.message}`);
            }
        } else {
            setError('An unexpected error occurred during Google sign-in.');
            console.error("Non-Firebase error:", err);
        }
    } finally {
        setLoading(false);
    }
  };

    return (
        <Container className="d-flex justify-content-center align-items-center login-page">
            <Card className="p-4 form-card" >
                <h2 className="text-center fw-bold mb-4">{isRegistering ? 'Register' : 'Login'}</h2>
                <Form onSubmit={handleSubmit}>
                    {/* {error && !showResetModal && <Alert variant="danger" className="mb-3">{error}</Alert>} */}

                    <Form.Group className="mb-3">
                        <Form.Label className="">Email</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter email"
                            value={ email }
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input"
                            isInvalid={ !!valueError.email }
                        />
                        <Form.Control.Feedback type="invalid">{ valueError.email }</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="">Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={ password }
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input"
                            isInvalid={ !!valueError.password }
                        />
                        <Form.Control.Feedback type="invalid">{ valueError.password }</Form.Control.Feedback>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100 mt-3 d-flex justify-content-center" disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : (isRegistering ? 'Register' : 'Login')}
                    </Button>
                </Form>
                <div className="mt-3 text-center">
                    <Button variant="link" onClick={() => setIsRegistering(prev => !prev)} disabled={loading}>
                        {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                    </Button>
                    {!isRegistering && ( // Only show forgot password link on login form
                        <Button variant="link" className="ms-2" onClick={() => {
                            setShowResetModal(true);
                            setError('');
                            setResetMessage('');
                        }} disabled={loading}>
                            Forgot Password?
                        </Button>
                    )}
                </div>

                {!isRegistering && (
                    <>
                        <div className="d-flex align-items-center my-3">
                            <hr className="flex-grow-1" />
                            <span className="mx-2 text-secondary">OR</span>
                            <hr className="flex-grow-1" />
                        </div>
                        <Button
                            variant="secondary"
                            className="w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" style={{ height: '1.2em' }} />
                            Sign in with Google
                        </Button>
                    </>
                )}
            </Card>

            <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered className="password-reset-form">
                <Modal.Header closeButton>
                    <Modal.Title className="reset-title">Reset Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {resetMessage && <Alert variant="success">{resetMessage}</Alert>}
                    {error && showResetModal && <Alert variant="danger">{error}</Alert>}
                    <p>Enter your email address and we'll send you a link to reset your password.</p>
                    <Form onSubmit={handlePasswordReset}>
                        <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            isInvalid={ !!valueError.resetEmail }
                        />
                        <Form.Control.Feedback type="invalid">{ valueError.resetEmail }</Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100 d-flex justify-content-center" disabled={loading}>
                            {loading && showResetModal ? <Spinner animation="border" size="sm" /> : 'Send Reset Email'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
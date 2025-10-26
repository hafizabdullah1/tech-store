import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../Components/Message';
import FormContainer from "../Components/FormContainer"
import Loader from '../Components/Loader';
import { register } from "../Actions/userAction";



function RegisterScreen() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState(null);

    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const userRegister = useSelector((state) => state.userRegister)
    const { loading, error, userInfo } = userRegister;

    const redirect = location.search ? location.search.split("=")[1] : "/";

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }

    }, [userInfo ,  navigate])

    const submitHandler = (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setMessage('Password does not match')
        }
        else{
            dispatch(register(name, email, password))
        }
    }

    return (
        <>
            <FormContainer>
                <h1>Sign Up</h1>
                {error && <Message variant="danger">{error}</Message>}
                {message && <Message variant="danger">{message}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                    {/* name */}
                    <Form.Group controlId='name'>
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control type='name' placeholder='Enter your name' value={name} onChange={(e) => { setName(e.target.value) }}>
                        </Form.Control>
                    </Form.Group>
                    {/* email */}
                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control type='email' placeholder='Enter Email Address' value={email} onChange={(e) => { setEmail(e.target.value) }}>
                        </Form.Control>
                    </Form.Group>
                    {/* password */}
                    <Form.Group controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' placeholder='Enter Your password' value={password} onChange={(e) => { setPassword(e.target.value) }}>
                        </Form.Control>
                        {/* conmfirm, */}
                        <Form.Group controlId='confirmPassword'>
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control type='password' placeholder='Enter Confirm Passowrd' value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }}>
                            </Form.Control>
                        </Form.Group>
                    </Form.Group>
                    <Button type='submit' variant='primary'>
                        Sign Up
                    </Button>
                </Form>
                <Row>
                    <Col>
                       Have an a Account? <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>Login</Link>
                    </Col>
                </Row>
            </FormContainer>
        </>
    )
}

export default RegisterScreen;
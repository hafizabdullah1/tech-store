import React, { useState } from 'react';
import { Col, Form, Button } from 'react-bootstrap';
import FormContainer from '../Components/FormContainer';
import CheckoutSteps from '../Components/CheckoutSteps';
import { savePaymentMethod } from "../Actions/cartAction";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function PaymentScreen() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart

    if (!shippingAddress) {
        navigate('/shipping')
    }

    const [paymentMethod, setPaymentMethod] = useState("PayPal");

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder');
    }

    return (
        <>
            <FormContainer>
                <CheckoutSteps step1 step2 step3 />
                <h1>Payment Method</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group>
                        <Form.Label as='legend'>Select Method</Form.Label>
                        <Col>
                            <Form.Check
                                type='radio'
                                label='PayPal or Credit Card'
                                id='PayPal'
                                name='paymentMethod'
                                value='PayPal'
                                checked
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            ></Form.Check>
                        </Col>
                    </Form.Group>
                    <Button type='submit' variant='primary' className="mt-3">
                        Continue
                    </Button>
                </Form>
            </FormContainer>
        </>
    )
}

export default PaymentScreen

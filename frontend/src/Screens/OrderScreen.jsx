import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { getOrderDetails, payOrder, deliverOrder } from "../Actions/orderAction";
import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../Constants/orderConstants";


function OrderScreen() {
  const { id } = useParams();
  const orderId = id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paypalClientId, setPaypalClientId] = useState("");

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;


  if (!loading && order) {
    // Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult, "paymentResult");
    dispatch(payOrder(orderId, paymentResult));
  };

  useEffect(() => {
    const fetchPayPalClientId = async () => {
      try {
        const { data: clientId } = await axios.get("/api/config/paypal");
        setPaypalClientId(clientId);
      } catch (error) {
        console.error("Error fetching PayPal client ID:", error);
      }
    };

    if (!userInfo) {
      navigate("/login");
      return;
    }

    if (!order || order._id !== orderId || successPay || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid && !paypalClientId) {
      fetchPayPalClientId();
    }
  }, [
    dispatch,
    orderId,
    successPay,
    order,
    successDeliver,
    userInfo,
    navigate,
    paypalClientId,
  ]);


  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  }

  if (!loading && !order && !error) {
    return <Message variant="danger">Unable to load order details.</Message>;
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name :</strong>
                {order?.user?.name}
              </p>
              <p>
                <strong>Email :</strong>
                <a href={`mailto:${order?.user?.email}`}>{order?.user?.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order?.shippingAddress.address}, {order?.shippingAddress.city}
                {order?.shippingAddress.postalCode},
                {order?.shippingAddress.country}
              </p>
              {order?.isDelivered ? (
                <Message variant="success">
                  Delivered On{order?.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not isDelivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order?.paymentMethod}
              </p>
              {order?.isPaid ? (
                <Message variant="success">Paid On{order?.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order?.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order?.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order?.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order?.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order?.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order?.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {!order?.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!paypalClientId ? (
                    <Loader />
                  ) : (
                    <PayPalScriptProvider options={{ "client-id": paypalClientId, currency: "USD" }}>
                      <PayPalButtons
                        createOrder={(data, actions) => {
                          return actions.order?.create({
                            purchase_units: [
                              {
                                amount: {
                                  value: order?.totalPrice,
                                },
                              },
                            ],
                          });
                        }}
                        onApprove={(data, actions) => {
                          return actions.order?.capture().then((details) => {
                            successPaymentHandler(details);
                          });
                        }}
                      />
                    </PayPalScriptProvider>
                  )}
                </ListGroup.Item>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order?.isPaid &&
                !order?.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
}
export default OrderScreen;
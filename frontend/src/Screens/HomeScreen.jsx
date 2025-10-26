import React, { useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Product from "../Components/Product";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../Actions/productActions";
import Message from "../Components/Message";
import Loader from "../Components/Loader";
import { useParams } from "react-router-dom";
import Paginate from "../Components/Paginate";
import ProductCarousel from "../Components/ProductCarousel";


const HomeScreen = () => {

  const dispatch = useDispatch();

  const { keyword, pageNumber } = useParams();

  useEffect(() => {
    dispatch(listProducts(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber]);

  const productList = useSelector((state) => state.productList);
  const { loading, products, error, page, pages } = productList;

  return (
    <>
      {!keyword && <ProductCarousel />}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (

        <Row>
          {products.map((product, i) => (
            <Col key={i} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>

      )}
      <Paginate pages={pages} page={page} keyword={keyword ? keyword : ""} />
    </>
  );
};

export default HomeScreen;

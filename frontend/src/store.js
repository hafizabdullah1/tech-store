import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import {
  productDetailsReducer,
  productListReducer,
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer
} from "./Reducers/productReducers";

import { orderCreateReducer, orderDetailsReducer, orderListMyReducer, orderPayReducer, orderListReducer, orderDeliverReducer } from "./Reducers/orderReducer";

import { userDetailsReducer, userLoginReducer, userRegisterReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer } from "./Reducers/userReducers";

import { cartReducer } from "./Reducers/cartReducers";

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productReviewCreate: productReviewCreateReducer,
  productTopRated:productTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userUpdate: userUpdateReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderDeliver: orderDeliverReducer,
  orderListMy: orderListMyReducer,
  orderList: orderListReducer,
});


const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? JSON.parse(localStorage.getItem("cartItems"))
  : [];

const shippingAddressFromStorage = localStorage.getItem("shippingAddress") ? JSON.parse(localStorage.getItem('shippingAddress')) : {};

const initialState = {
  cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage },
  userLogin: { userInfo: userInfoFromStorage }
};



const middleware = [thunk];

const composeEnhancer = 
  (typeof window !== 'undefined' && 
   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) 
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 
  : compose;

const store = createStore(
  reducer,
  initialState,
  composeEnhancer(applyMiddleware(...middleware))
);

export default store;

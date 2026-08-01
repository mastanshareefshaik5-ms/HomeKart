import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Checkout from "./pages/Checkout/Checkout";
import Products from "./pages/Products/Products";
import Categories from "./pages/Categories/Categories";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import Order from "./pages/Order/Order";
import Profile from "./pages/Profile/Profile";

import { CartProvider } from "./context/CartContext";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {

  return (

    <CartProvider>

      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/products"
            element={<Products />}
          />

          <Route
            path="/categories"
            element={<Categories />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/wishlist"
            element={<Wishlist />}
          />

          <Route
            path="/product-details/:id"
            element={<ProductDetails />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/order-success"
            element={<OrderSuccess />}
          />

          <Route
            path="/order"
            element={<Order />}
          />

        </Routes>

        <Footer />

      </BrowserRouter>

    </CartProvider>

  );

}

export default App;
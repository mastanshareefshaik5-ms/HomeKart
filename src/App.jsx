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

import AdminDashboard from "./components/AdminDashboard";

import { CartProvider } from "./context/CartContext";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import AdminProducts from "./pages/AdminProducts/AdminProducts";
import AdminOrders from "./pages/AdminOrders/AdminOrders";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import AdminReports from "./pages/AdminReports/AdminReports";
import AddProduct from "./pages/AddProduct/AddProduct";
import EditProduct from "./pages/EditProduct/EditProduct";

function App() {

  return (

    <AuthProvider>

      <CartProvider>

        <BrowserRouter>

          <Navbar />

          <Routes>

            {/* HOME */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* PRODUCTS */}
            <Route
              path="/products"
              element={<Products />}
            />

            {/* CATEGORIES */}
            <Route
              path="/categories"
              element={<Categories />}
            />

            {/* LOGIN */}
            <Route
              path="/login"
              element={<Login />}
            />

            {/* REGISTER */}
            <Route
              path="/register"
              element={<Register />}
            />

            {/* PROFILE */}
            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* CART */}
            <Route
              path="/cart"
              element={<Cart />}
            />

            {/* WISHLIST */}
            <Route
              path="/wishlist"
              element={<Wishlist />}
            />

            {/* PRODUCT DETAILS */}
            <Route
              path="/product-details/:id"
              element={<ProductDetails />}
            />

            {/* CHECKOUT */}
            <Route
              path="/checkout"
              element={<Checkout />}
            />

            {/* ORDER SUCCESS */}
            <Route
              path="/order-success"
              element={<OrderSuccess />}
            />

            {/* ORDERS */}
            <Route
              path="/order"
              element={<Order />}
            />

            {/* ADMIN DASHBOARD */}
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />
            <Route
               path="/admin/products"
               element={<AdminProducts />}
            />
            <Route
              path="/admin/orders"
              element={<AdminOrders />}
            />
            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />
            <Route
              path="/admin/reports"
              element={<AdminReports />}
            />
            <Route
              path="/admin/products/add"
              element={<AddProduct />}
            />
            <Route
              path="/admin/products/edit/:id"
              element={<EditProduct />}
            />

          </Routes>

          <Footer />

        </BrowserRouter>

      </CartProvider>

    </AuthProvider>

  );

}

export default App;
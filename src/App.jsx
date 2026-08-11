import { Routes, Route } from "react-router-dom";

// ======================================================
// CUSTOMER
// ======================================================

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import Checkout from "./pages/Checkout/Checkout";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Order from "./pages/Order/Order";
import Profile from "./pages/Profile/Profile";
// ======================================================
// ADMIN
// ======================================================

import AdminRoute from "./components/AdminRoute/AdminRoute";
import AdminLayout from "./components/AdminLayout/AdminLayout";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProducts from "./pages/AdminProducts/AdminProducts";
import AddProduct from "./pages/AddProduct/AddProduct";
import AdminOrders from "./pages/AdminOrders/AdminOrders";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import AdminReports from "./pages/AdminReports/AdminReports";


// ======================================================
// CUSTOMER LAYOUT
// ======================================================

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}


// ======================================================
// APP
// ======================================================

function App() {
  return (
    <Routes>

      {/* ==================================================
          CUSTOMER ROUTES
      ================================================== */}

      <Route
        path="/"
        element={
          <CustomerLayout>
            <Home />
          </CustomerLayout>
        }
      />

      <Route
        path="/products"
        element={
          <CustomerLayout>
            <Products />
          </CustomerLayout>
        }
      />

      <Route
        path="/products/:id"
        element={
          <CustomerLayout>
            <ProductDetails />
          </CustomerLayout>
        }
      />

      <Route
        path="/cart"
        element={
          <CustomerLayout>
            <Cart />
          </CustomerLayout>
        }
      />

      <Route
        path="/wishlist"
        element={
          <CustomerLayout>
            <Wishlist />
          </CustomerLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <CustomerLayout>
            <Checkout />
          </CustomerLayout>
        }
      />

      <Route
        path="/order"
        element={
          <CustomerLayout>
            <Order />
          </CustomerLayout>
        }
      />

      <Route
        path="/orders"
        element={
          <CustomerLayout>
            <Order />
          </CustomerLayout>
        }
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


      {/* ==================================================
          ADMIN ROUTES
      ================================================== */}

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >

        {/* /admin */}
        <Route
          index
          element={<AdminDashboard />}
        />

        {/* /admin/products */}
        <Route
          path="products"
          element={<AdminProducts />}
        />

        {/* /admin/products/add */}
        <Route
          path="products/add"
          element={<AddProduct />}
        />

        {/* /admin/orders */}
        <Route
          path="orders"
          element={<AdminOrders />}
        />

        {/* /admin/users */}
        <Route
          path="users"
          element={<AdminUsers />}
        />

        {/* /admin/reports */}
        <Route
          path="reports"
          element={<AdminReports />}
        />

      </Route>

    </Routes>
  );
}

export default App;
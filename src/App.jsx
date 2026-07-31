import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import ProductDetails from "./pages/ProductDetails/ProductDetails";

import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout/Checkout";
import Products from "./pages/Products/Products";

import {
BrowserRouter,
Routes,
Route
} from "react-router-dom";


function App(){


return(

<CartProvider>

<BrowserRouter>


<Navbar />

<Products />

<Routes>


<Route path="/" element={<Home/>}/>

<Route path="/login" element={<Login/>}/>

<Route path="/register" element={<Register/>}/>

<Route path="/cart" element={<Cart/>}/>

<Route path="/wishlist" element={<Wishlist/>}/>

<Route path="/product-details" element={<ProductDetails/>}/>
<Route
  path="/checkout"
  element={<Checkout/>}
/>


</Routes>


<Footer />


</BrowserRouter>

</CartProvider>

);


}


export default App;
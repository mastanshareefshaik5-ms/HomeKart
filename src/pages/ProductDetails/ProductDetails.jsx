import "./ProductDetails.css";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../../context/CartContext";


function ProductDetails(){

  const location = useLocation();

  const { addToCart } = useContext(CartContext);

  const product = location.state?.product;


  const demoProduct = product || {
    name:"Basmati Rice 5kg",
    price:650
  };


  return(

    <div className="product-details">


      <div className="product-details-image">
        🛒
      </div>


      <div className="product-info">


        <h1>
          {demoProduct.name}
        </h1>


        <div>
          ⭐⭐⭐⭐⭐
        </div>


        <h2>
          ₹{demoProduct.price}
        </h2>


        <p>
          Premium quality product from HOMEKART.
        </p>


        <button
          className="cart-button"
          onClick={() => addToCart(demoProduct)}
        >
          Add to Cart
        </button>


      </div>


    </div>

  );

}


export default ProductDetails;
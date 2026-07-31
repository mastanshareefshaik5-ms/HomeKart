import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-section">
        <h3>HOMEKART</h3>
        <p>
          Your trusted online store for daily household essentials.
        </p>
      </div>


      <div className="footer-section">
        <h3>Quick Links</h3>
        <p>Home</p>
        <p>Products</p>
        <p>Cart</p>
        <p>Orders</p>
      </div>


      <div className="footer-section">
        <h3>Customer Support</h3>
        <p>Contact Us</p>
        <p>Help Center</p>
        <p>Returns</p>
      </div>


      <div className="footer-section">
        <h3>Follow Us</h3>
        <p>Facebook</p>
        <p>Instagram</p>
        <p>Twitter</p>
      </div>


    </footer>
  );
}

export default Footer;
import "./Home.css";
import Banner from "../../components/Banner/Banner";
import ProductCard from "../../components/ProductCard/ProductCard";


function Home() {


const categories = [
  {name:"Groceries", icon:"🛒"},
  {name:"Fruits & Vegetables", icon:"🥦"},
  {name:"Dairy Products", icon:"🥛"},
  {name:"Snacks", icon:"🍪"},
  {name:"Cleaning", icon:"🧼"},
  {name:"Personal Care", icon:"🧴"}
];


const products = [

 {
  name:"Basmati Rice 5kg",
  price:650
 },

 {
  name:"Sunflower Oil 1L",
  price:150
 },

 {
  name:"Premium Milk",
  price:60
 },

 {
  name:"Chocolate Snacks",
  price:120
 }

];


return (

<div className="home">


<Banner />


<section className="hero">

<h1>
Welcome to HOMEKART
</h1>

<p>
Your Daily Household Essentials Delivered to Your Doorstep
</p>

<button>
Shop Now
</button>

</section>



<section className="categories">

<h2>
Shop by Category
</h2>


<div className="category-grid">

{
categories.map((item,index)=>(

<div className="category-card" key={index}>

<div className="category-icon">
{item.icon}
</div>

<h3>
{item.name}
</h3>

</div>

))
}

</div>

</section>



<section className="products">

<h2>
🔥 Best Sellers
</h2>


<div className="product-grid">

{
products.map((item,index)=>(

<ProductCard 
key={index}
product={item}
/>

))
}

</div>


</section>



</div>

);

}


export default Home;
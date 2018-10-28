import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route} from 'react-router-dom';
import Category from "./category/Category";
import Cart from "./cart/Cart";
import CartPopUp from "./cartPopUp/cartPopUp"
import Product from "./product/Product";
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.state = {
      'products' : [],
      'cart' : {},
      'location': ''
    }
  }

  componentWillMount() {
    this.getCart();
  }

  getCart() {
    let cart = JSON.parse(localStorage.getItem('cart'));
    // cart not initalizing properly
    
    if (cart) {
      this.setState({ cart: cart });      
    } else {    
        cart = {
            'items' : []
        };
    }
  }

  render() {
    let cart = this.state.cart.items;
    
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Link to="/">
              <img src="../media/logo.png" className="App-logo" alt="logo"/>
            </Link>
            
            <div className="App-header-center">
              <Link to="/">Home</Link>  
              <Link to="/">Shop</Link>  
              <Link to="/">Journal</Link>  
              <Link to="/">More</Link>  
            </div>

            <Link className="App-header-right" to="/cartPopUp">My Cart ({cart ? cart.length : 0})</Link>
          </header>

          <div>{this.state.location}</div>

          <Route exact path="/" component={Category} />
          <Route exact path="/cart" component={Cart}/>
          <Route path="/cartPopUp" component={CartPopUp}/>
          <Route exact path="/product/:title" component={Product}/>
        </div>
      </Router>
    );
  }
}

export default App;

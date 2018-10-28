import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './cartPopUp.css';

class CartPopUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            'cart' : {},
            'cartTotal': 0
        }

        this.removeItem = this.removeItem.bind(this);
    }

    componentWillMount() {
        this.getCart();      
    }

    getCart() {
        let cart = JSON.parse(localStorage.getItem('cart'));
        
        if (cart) {
            this.setState({ cart: cart }, () => {
                this.getCartTotal();
            });
        } else {    
            cart = {
                'items' : []
            };
        }
    }

    getCartTotal() {
        let items = this.state.cart.items,
            productTotal = 0;
        
        items.forEach(element => {
            productTotal = element.quantity * element.price;
            this.setState({ 'cartTotal': this.state.cartTotal += productTotal });            
        });
    }
    
    handleMatch(product) {
        return this.state.cart.items.findIndex( product => product.title === product.title);
    }
    
    handleCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));
    }

    removeItem(product) {
        let cartItems = this.state.cart.items,
            match = this.handleMatch(product);            

        if (this.state.cart.items && match >= 0) {
            let items = [...this.state.cart.items],
                item = {...items[match]};

            item.quantity = this.state.cart.items[match].quantity += product.quantity;
            items[match] = item;

            let newItems = items.filter((_, i) => i !== match)

            this.setState({
                'cart': {
                    'items': newItems
                }
            },() => {
                this.handleCartToStorage();
            });
        }
    }

    render() {
        let items = this.state.cart.items;

        if (!items) {
            items = [];
        }
       
        return (
            <div className="cartPopUp">
                { items.map(item => 
                    <div key={item.title} className="cartPopUp-product-tile">
                        <div className="cartPopUp-image-wrapper">
                            <img src={`../media/${item.image}`} alt={item.image}/>
                        </div>
                        <div className="cartPopUp-product-details">
                            <span className="cartPopUp-product-title">{item.title}</span>
                            <span>x {item.quantity}</span>
                            <span className="cartPopUp-product-brand">{item.brand}</span>
                            <span className="cartPopUp-product-price">${item.price}.00</span>
                        </div>
                        <button onClick={() => this.removeItem(item)}>x</button>
                    </div>
                )}

                <hr/>
                
                <div className="cartPopUp-summary">
                    <span>Total</span>
                    <span>${this.state.cartTotal}.00</span>
                </div>

                <div className="cartPopUp-actions">
                    <Link to="/cart">
                        <button className="cartPopUp-view-cart button-outline">View Cart</button>
                    </Link>  
                    <button className="cartPopUp-checkout button-dark">Checkout</button>
                </div>

            </div>
        );
    }
}

export default CartPopUp;

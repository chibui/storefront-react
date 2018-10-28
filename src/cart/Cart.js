import React, { Component } from 'react';
import './Cart.css';

class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            'cart' : {},
            'cartTotal': 0
        }

        this.goBack = this.goBack.bind(this);
        this.addQuantity = this.addQuantity.bind(this);
        this.decreaseQuantity = this.decreaseQuantity.bind(this);
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

    goBack() {
        this.props.history.goBack();
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
                // refresh state for total
            });
        }
    }

    handleCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));

    }

    handleProductQuantity(product, value) {
        let cartItems = this.state.cart.items,
            match = this.handleMatch(product.title);
        
        if (cartItems && match >= 0) {
            let items = [...cartItems],
                item = {...items[match]},
                newQuantity = item.quantity + value;

            item.quantity = cartItems[match].quantity = newQuantity;
            items[match] = item;
            this.setState({
                'cart': {
                    'items': items
                }
            }, () => {
                this.handleCartToStorage();
            });
        }
    }

    addQuantity(product) {        
        this.handleProductQuantity(product, 1);
    }

    decreaseQuantity(product) {
        this.handleProductQuantity(product, -1);
    }

    render() {
        let items = this.state.cart.items;

        if (!items.length) {
            items = [];
        }

        return (
            <div className="cart">
                <h1>Shopping Cart</h1>
                
                <div className="cart-table">
                    <div className="cart-table-headings">
                        <h3 className="cart-table-headings-product">Product</h3>
                        <h3 className="cart-table-headings-quanity">Quantity</h3>
                        <h3 className="cart-table-headings-total">Total</h3>
                        <h3 className="cart-table-headings-action">Action</h3>
                    </div>
                    { items.map(item => 
                        <div key={item.title} className="cart-product-tile">
                            <div className="cart-image-wrapper">
                                <img src={`../media/${item.image}`} alt={item.image}/>
                            </div>
                            <div className="cart-product-details">
                                <span className="cart-product-brand">{item.brand}</span>
                                <span className="cart-product-title">{item.title}</span>
                            </div>
                            <div className="cart-product-quantity">
                                <div className="cart-product-quantity-value">{item.quantity}</div>
                                <div className="cart-product-quantity-action">
                                    <button onClick={() => this.addQuantity(item)}>+</button>
                                    <button onClick={() => this.decreaseQuantity(item)}>-</button>
                                </div>
                            </div>
                            <span className="cart-product-total">${item.price * item.quantity}.00</span>
                            <button className="cart-product-remove-item" onClick={() => this.removeItem(item.title)}>x</button>
                        </div>
                    )}

                    <hr/>
                    
                    <div className="cart-summary">
                        <span className="cart-summary-title">Cart Overview</span>
                        <span className="cart-summary-totals">
                            <span>Subtotal</span>
                            <span>${this.state.cartTotal}.00</span>
                        </span>
                        <span className="cart-summary-totals">
                            <span>Total</span>
                            <span>${this.state.cartTotal}.00 CAD</span>
                        </span>
                    </div>

                    <hr/>

                    <div className="cart-actions">
                        <span className="cart-action-back" onClick={this.goBack}>Continue shopping</span>
                        <button className="button-dark">Checkout (${this.state.cartTotal}.00)</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cart;

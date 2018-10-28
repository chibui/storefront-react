import React, { Component } from 'react';
import './Product.css';

class Product extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            'title': props.match.params.title,
            'products': [],
            'product': {},
            'quantity': 1,
            'cart': {},
            'lineItem': {}
        };

        this.addQuantity = this.addQuantity.bind(this);
        this.decreaseQuantity = this.decreaseQuantity.bind(this);
        this.addToCart = this.addToCart.bind(this);
        console.log('props', props);
    }

    componentWillMount() {
        this.getProducts();
        this.getCart();
    }
    
    toJSON(string) {
        return JSON.parse(string);
    }

    toString(object) {
        return JSON.stringify(object);
    }

    getCart() {
        let cart = JSON.parse(localStorage.getItem('cart'));
        // cart not initalizing properly
        if (!cart) {
            cart = {
                'items' : []
            };
            this.setState({ 'cart': cart }); 
        } else {
            this.setState({ 'cart': cart }); 
        }
        console.log('state', this.state);
        
    }

    handleProductQuantity() {

        let product = Object.assign({}, this.state.product);
        product.quantity = this.state.quantity;

        let cartItems = this.state.cart.items,
            match = cartItems.findIndex( x => x.title === product.title)

        if (this.state.cart.items && match >= 0) {

            let items = [...this.state.cart.items];
            let item = {...items[match]};
            item.quantity = this.state.cart.items[match].quantity += this.state.quantity;
            items[match] = item;
            this.setState({
                'cart': {
                    'items': items
                }
            });
        } else {
            this.setState({'product': product},() => {
                this.handleAddToCart();
            });
        }
    
    }

    addToCart() {
        this.getCart();
        this.handleProductQuantity();
        this.handleCartToStorage();
    }

    handleAddToCart() {
        this.setState({
            'cart': {
                'items': [...this.state.cart.items, this.state.product]
            }
        })
    }

    handleCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));

    }

    addQuantity() {        
        this.setState({'quantity': this.state.quantity + 1});
    }

    decreaseQuantity() {
        if (this.state.quantity > 1 ) {
            this.setState({'quantity': this.state.quantity - 1});
        }
    }

    findProduct() {
        let products = this.state.products,
            title = this.state.title;
               
        this.setState({ 'product': products.find( product => product.title === title ) });

    }
    
    getProducts() {
        fetch('/products.json')
        .then( response => response.json())
        .then( products => this.setState({'products': products}))
        .then( response => this.findProduct());
    }

    render() {
        let item = this.state.product;
        return (
            <div className="product">
                <img src={`../media/${item.image}`} className="product-image" alt="logo"/>
                <div className="product-details">
                    <p className="product-details-brand">{item.brand}</p>
                    <h1 className="product-details-title">{item.title}</h1>
                    <p className="product-details-price">${item.price}.00</p>
                    <p className="product-details-description">{item.description}</p>
                    <hr/>
                    <div className="product-actions">
                        <div className="product-quantity">
                            <div className="product-quantity-value">{this.state.quantity}</div>
                            <div className="product-quantity-action">
                                <button onClick={this.addQuantity}>+</button>
                                <button onClick={this.decreaseQuantity}>-</button>
                            </div>
                        </div>
                        <button className="button-dark product-add-to-cart" onClick={this.addToCart}>Add to cart</button>
                    </div>
                </div>

            </div>
        );
    }
}

export default Product;

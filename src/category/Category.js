import React, { Component } from 'react';
import { Link } from 'react-router-dom'; 
import './Category.css';

class Category extends Component {

    constructor() {
        super();
        this.state = {
            'cart': {},
            'items': []
        }
        this.addItemToCart = this.addItemToCart.bind(this);
    }

    componentWillMount() {
        this.getItems();
        this.getCart();
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
    }

    getItems() {
        fetch('/products.json')
        .then( response => response.json())
        .then( items => this.setState({'items': items}))
    }

    addItemToCart(item) {
        this.handleProductQuantity(item);
        this.handleCartToStorage();
    }

    handleProductQuantity(product) {
        let cartItems = this.state.cart.items,
            match = cartItems.findIndex( x => x.title === product.title);

        product.quantity = 1;

        if (this.state.cart.items && match >= 0) {
            let items = [...this.state.cart.items],
                item = {...items[match]};

            item.quantity = this.state.cart.items[match].quantity += product.quantity;
            items[match] = item;

            this.setState({
                'cart': {
                    'items': items
                }
            });
        } else {            
            this.setState({'product': product},() => {
                this.handleAddToCart(product);
            });
        }
    
    }

    handleAddToCart(product) {        
        this.setState({
            'cart': {
                'items': [...this.state.cart.items, product]
            }
        })
    }

    handleCartToStorage() {
        localStorage.setItem('cart', JSON.stringify(this.state.cart));

    }

    render() {
        let items = this.state.items
        return (
            <div className="Category">
                {/* split out into header component */}
                <header className="header-hero">
                    <div className="header-box">
                        <div className="header-block">
                            <h1 className="header-title">Plates</h1>
                            <span>
                                lorem isBacon ipsum dolor amet buffalo pork chop pork loin beef ribs pancetta short ribs.
                            
                                Corned beef spare ribs turducken, ham hock jowl turkey venison ribeye. 
                            </span>
                        </div>
                    </div>
                </header>
                
                <div className="product-list">   
                    { items.map(item => 
                        <div key={item.title} className="product-tile">
                            <div className="product-tile-details">
                                <Link to={`/product/${item.title}`}>
                                    <div className="product-image-wrapper">
                                        <img src={`../media/${item.image}`} alt={item.title}/>
                                    </div>
                                </Link>
                                <span className="product-brand">{item.brand}</span>
                                <span className="product-title">{item.title}</span>
                                {/* is there a filter to format currency */}
                                <span className="product-price">${item.price}.00</span>
                            </div>

                            <div className="product-tile-overlay">
                                <Link to={`/product/${item.title}`}>
                                    <button className="button-dark" >View Details</button>
                                </Link>
                                <button className="button-grey" onClick={() => this.addItemToCart(item)}>Add To Cart</button>
                            </div>
                        </div>
                    )}
                </div>
                
            </div>
        );
    }
}

export default Category;

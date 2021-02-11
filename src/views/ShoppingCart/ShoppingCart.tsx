import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { CartList, OrderSummary } from '../../components';
import { MenuItem, OrderItem } from '../../models';
import './ShoppingCart.css';

interface ShoppingCartProps {}

interface ShoppingCartState {
    cart: OrderItem[];
}

export default class ShoppingCart extends Component<
    ShoppingCartProps,
    ShoppingCartState
> {

    readonly state: Readonly<ShoppingCartState> ={
        cart: [
            new OrderItem(new MenuItem(350, "Cookies","Cookies","",["Oatmeal"]),3),
            new OrderItem(new MenuItem(1000, "Cheesecake","Cheesecake","",["Strawberry", "Cherry", "Rum Cream"]),2),
        ]
    }

    render() {
        return (
            <div id="cart">
                <Link to="/menu" className="nav" >Back to Menu</Link>
                <h2 className="pgtitle">My Order</h2>
                <CartList shoppingCart={this}/>
                <OrderSummary shoppingCart={this}/>
            </div>
        );
    }
}

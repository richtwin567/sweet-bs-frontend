import React, { Component } from 'react';
import { ShoppingCartController } from '../../../effects';
import './CartList.css';
import CartListItem from '../CartListItem/CartListItem';

interface CartListProps {
    controller: ShoppingCartController;
}

interface CartListState {}

export default class CartList extends Component<CartListProps, CartListState> {
    render() {
        const list = this.props.controller.cartItems.map((item) => {

            return (
                <CartListItem
                    key={item.menuitem.id}
                    item={item}
                    controller={this.props.controller}
                />
            );
        });
        return <div id="cart-list">{list}</div>;
    }
}
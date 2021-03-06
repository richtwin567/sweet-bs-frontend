import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../context';
import CartList from './CartList/CartList';
import EmptyCart from './EmptyCart/EmptyCart';
import OrderSummary from './OrderSummary/OrderSummary';
import './ShoppingCart.css';

/**
 * The shopping cart where a customer may modify their order or checkout
 * @returns The shopping cart component
 */
export default function ShoppingCart() {
    const context = useContext(AppContext);

    return (
        <div id="cart">
            <main>
                <Link to="/menu" className="nav">
                    Back to Menu
                </Link>
                <h2 className="pgtitle">My Order</h2>
                {context.cart.length > 0 ? <CartList /> : <EmptyCart />}
            </main>
            <aside>
                <OrderSummary />
            </aside>
        </div>
    );
}

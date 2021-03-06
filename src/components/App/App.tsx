// React Imports
import React, { useEffect } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { ToastContainer, Zoom } from 'react-toastify';

// Views Imports
import {
    Menu,
    MyAccount,
    NotFound,
    ProcessOrder,
    ShoppingCart,
    MenuManager,
    AddMenuItem,
    EditItem,
    ManagementPortal,
    CustomerAnalytics,
    ShoppingList,
    SignUp,
    Login,
    UserOrders,
} from '../../views';

// Component Imports
import { OrderCollator, Dashboard } from '..';

import { AppHooks } from '../../hooks';
import './App.css';
import { Success } from '../../views/ProcessOrder/Success/Success';
import { AppContext } from '../../context';
import 'react-toastify/dist/ReactToastify.css';
import LoginFirst from '../LoginFirst/LoginFirst';

export default function App() {
    const [jwt, updateJWT] = AppHooks.useJWT();

    const [cart, updateCart] = AppHooks.useCart();

    /* useEffect(() => {
        let mounted = true;

        if (mounted) {
            updateJWT({
                type: 'login',
                username: 'ARich123',
                password: 't#st123',
            });

            //console.log(jwt);
        }

        return () => {
            mounted = false;
        };
    }, []); */

    return (
        <AppContext.Provider
            value={{
                jwt: jwt,
                updateJWT: updateJWT,
                cart: cart,
                updateCart: updateCart,
            }}
        >
            <BrowserRouter forceRefresh={false}>
                <Switch>
                    <Route exact path="/unauth">
                        <LoginFirst message="You are unauthorized to access this page. Login as admin first" />
                    </Route>
                    <Route exact path="/cart">
                        <ShoppingCart />
                    </Route>
                    <Route exact path="/menu">
                        <Menu />
                    </Route>
                    <Route exact path="/profile">
                        <MyAccount />
                    </Route>
                    <Route exact path="/processorder">
                        <ProcessOrder />
                    </Route>
                    <Route exact path="/signup">
                        <SignUp />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/portal/">
                        <ManagementPortal portalComponent={Dashboard} />
                    </Route>
                    <Route exact path="/portal/orders">
                        <ManagementPortal portalComponent={OrderCollator} />
                    </Route>
                    <Route exact path="/success">
                        <Success />
                    </Route>
                    <Route exact path="/portal/menu-manager">
                        <ManagementPortal portalComponent={MenuManager} />
                    </Route>
                    <Route exact path="/portal/menu-manager/add">
                        <ManagementPortal portalComponent={AddMenuItem} />
                    </Route>
                    <Route exact path="/portal/menu-manager/edit/:id">
                        <ManagementPortal portalComponent={EditItem} />
                    </Route>
                    <Route exact path="/portal/customers">
                        <ManagementPortal portalComponent={CustomerAnalytics} />
                    </Route>
                    <Route exact path="/portal/customers/:id">
                        <ManagementPortal portalComponent={UserOrders} />
                    </Route>
                    <Route exact path="/portal/ingredients">
                        <ManagementPortal portalComponent={ShoppingList} />
                    </Route>
                    <Route exact path="/">
                        <Redirect to="/menu" />
                    </Route>
                    <Route>
                        <NotFound />
                    </Route>
                </Switch>
            </BrowserRouter>
            <ToastContainer
                transition={Zoom}
                position="bottom-right"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </AppContext.Provider>
    );
}

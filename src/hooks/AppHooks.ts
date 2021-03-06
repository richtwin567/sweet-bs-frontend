import { JWT, ShoppingCartData } from '../models/AppData';
import { MenuItem, OrderItem } from '../models';
import { fromJSON, toJSON } from '../utils/JsonUtils';
import { Reducer, useEffect, useReducer, useState } from 'react';
import { toast } from 'react-toastify';

/**
 * Hooks to manage the global app state
 */

/**
 * The actions that may be taken when update the JWT
 */
export type JWTUpdateAction =
    | { type: 'login'; username: string; password: string }
    | { type: 'logout' };

/**
 * The JWT updater function
 */
export type JWTUpdater = (action: JWTUpdateAction) => Promise<void>;

/**
 *
 * @returns the jwt state and corresponding updater
 */
export function useJWT() {
    function init() {
        return (
            fromJSON<JWT>(localStorage.getItem('sweetbs-jwt')) ?? {
                token: null,
            }
        );
    }

    const [jwt, setJWT] = useState<JWT>(init());

    async function updateJWT(action: JWTUpdateAction) {
        switch (action.type) {
            case 'login':
                setJWT(await login(action.username, action.password));
                break;
            case 'logout':
                setJWT({ token: null });
                break;
            default:
                break;
        }
    }

    //
    useEffect(() => {
        localStorage.setItem('sweetbs-jwt', toJSON(jwt) ?? '');
    }, [jwt]);

    return <const>[jwt, updateJWT];
}

/**
 * Attempts to login a user with the given username and password
 * @param username the username of the user to log in
 * @param password the password
 * @returns the JWT generated by the server or a null JWT if login failed
 */
export async function login(username: string, password: string): Promise<JWT> {
    return await fetch('http://0.0.0.0:9090/auth/login', {
        body: toJSON({ username: username, password: password }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(async (res) => {
            if (res.status === 202) {
                return res.json();
            } else {
                toast.error((await res.json()).message, { className: "toast-error" });
                throw Error("Incorrect Credentials");
            }
        })
        .then((data) => fromJSON<JWT>(data) ?? { token: null })
        .catch((err) => ({ token: null }));
}

/**
 * Stores the fields for registration
 */
export interface IRegistration {
    username: string;
    password: string;
    passwordConfirm: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
}

/**
 * Attemps to sign a user up with the given registration object
 * @param registerObject The object containing the registration fields
 */
export async function register(registerObject: IRegistration) {
    // Destructuring object fields

    return await fetch('http://localhost:9090/auth/signup', {
        body: toJSON({
            username: registerObject.username,
            password: registerObject.password,
            firstname: registerObject.firstName,
            lastname: registerObject.lastName,
            email: registerObject.email,
            address: registerObject.address,
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((res) => {
            if (res.status === 401) {
                return res.json();
            } else if (res.status === 201) {
                return res.json();
            } else {
                return res.json();
            }
        })
        .catch((err) => ({ message: err }));
}

/**
 * The actions that may be taken for every call of updateCart
 */
export type UpdateCartAction =
    | { type: 'add'; item: MenuItem; qty: number }
    | { type: 'remove' | 'incrementQty' | 'decrementQty'; item: OrderItem }
    | { type: 'empty' };

/** A function that can Update the cart */
export type CartUpdater = React.Dispatch<UpdateCartAction>;

/**
 * Initialize the cart
 */
function cartInit(initial: ShoppingCartData): ShoppingCartData {
    var cart = fromJSON<ShoppingCartData>(localStorage.getItem('sweetbs-cart'));
    return cart ?? initial;
}

/**
 * Updates the cart based on the actions passed
 */
function cartReducer(
    cart: ShoppingCartData,
    action: UpdateCartAction
): ShoppingCartData {
    switch (action.type) {
        case 'add':
            return addItemToCart(cart, action.item, action.qty);
        case 'decrementQty':
            return decrementItemQty(cart, action.item);
        case 'incrementQty':
            return incrementItemQty(cart, action.item);
        case 'remove':
            return removeItem(cart, action.item);
        case 'empty':
            //Completely empties the cart
            return [];
        default:
            return cart;
    }
}

/**
 * Create a cart state to allow updating of the shopping cart in both app state and localStorage
 * @returns The cart state and corresponding setter
 */
export function useCart() {
    const [cart, updateCart] = useReducer<
        Reducer<ShoppingCartData, UpdateCartAction>,
        ShoppingCartData
    >(cartReducer, [], cartInit);

    useEffect(() => {
        localStorage.setItem('sweetbs-cart', toJSON(cart) ?? '[]');
    }, [cart]);

    return <const>[cart, updateCart];
}

/**
 * Adds a new menu item with a specified quantity to the cart if the menu item isn't already in the cart.
 * If the menuitem is in the cart, increase the quantity by `qty`
 *
 * @param cart The cart to be updated
 * @param menuitem Menu item selected by a user to be added to cart
 * @param qty the quantity of that menu item to be added
 */
function addItemToCart(
    cart: ShoppingCartData,
    menuitem: MenuItem,
    qty: number
): ShoppingCartData {
    // duplicate the existing cart
    var newCartItems = [...cart];
    // check if the menu item already exists in the cart by id since ids are unique
    var index = newCartItems.findIndex((v) => v.menuitem.id === menuitem.id);

    if (index === -1) {
        // add the new menu item if it is not in the cart
        var item: OrderItem = { menuitem: menuitem, qty: qty };
        newCartItems.push(item);
    } else {
        // otherwise increase the quantity
        newCartItems[index].qty += qty;
    }
    // update the cart in local storage as well as the app state
    return newCartItems;
}

/**
 * Increases the quantity of the specified cart item by 1
 * @param cart the cart to be updated
 * @param item An item in the cart whose quantity the user wants to adjust
 */
function incrementItemQty(
    cart: ShoppingCartData,
    item: OrderItem
): ShoppingCartData {
    // duplicate the existing cart
    var newCartItems = [...cart];
    // find the item in the cart
    var i = newCartItems.findIndex(
        (oitem) => oitem.menuitem.id === item.menuitem.id
    );
    // increase that item's quantity
    newCartItems[i].qty += 1;
    return newCartItems;
}

/**
 * Decreases the quantity of the specified cart item by 1 but only if the current quantity is greater than 1
 * @param cart the cart to be updated
 * @param item An item in the cart whose quantity the user wants to adjust
 */
function decrementItemQty(
    cart: ShoppingCartData,
    item: OrderItem
): ShoppingCartData {
    // duplicate the existing cart
    var newCartItems = [...cart];
    // find the item in the cart
    var i = newCartItems.findIndex(
        (oitem) => oitem.menuitem.id === item.menuitem.id
    );
    var oitem = newCartItems[i];
    if (oitem.qty > 1) {
        // decrease that item's quantity if the quantity if greater than 1
        oitem.qty -= 1;
    }
    newCartItems[i] = oitem;
    return newCartItems;
}

/**
 * Removes an item from the cart
 * @param cart the cart to be updated
 * @param item the item to be removed
 */
function removeItem(cart: ShoppingCartData, item: OrderItem): ShoppingCartData {
    // duplicate cart
    var newCart = [...cart];
    // filter out the item to be removed
    newCart = newCart.filter((oitem) => oitem.menuitem.id !== item.menuitem.id);
    return newCart;
}

export function checkAuthorization(jwt: JWT) {
    fetch("http://0.0.0.0:9090/isauthorized", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Access-Token': jwt.token ?? "",
        }
    }).then(res=> res.status!==200 && window.location.replace("/unauth"))
}
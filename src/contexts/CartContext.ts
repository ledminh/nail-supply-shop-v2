
import { createContext, useState, useContext, useCallback } from 'react';
import { OrderedProduct } from '@/types/product';

import { useEffect, useReducer } from 'react';

interface CartContextValue {
    cart: OrderedProduct[];
    updateCart: (id: string, quantity: number) => void;
    addToCart: (orderedProduct: OrderedProduct) => void;
    removeProduct: (id: string) => void;
    clearCart: () => void;
}


const initContextValue: CartContextValue = {
    cart: [],
    updateCart: () => {},
    addToCart: () => {},
    removeProduct: () => {},
    clearCart: () => {},
};


const CartContext = createContext<CartContextValue>(initContextValue);

export default CartContext;


export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};

type State = {
    cart: OrderedProduct[];
};

const initialState:State = {
    cart: [],
};

type Action = { type: 'ADD_TO_CART'; payload: OrderedProduct } | { type: 'UPDATE_CART'; payload: { id: string; quantity: number } } | { type: 'REMOVE_PRODUCT'; payload: string } | { type: 'SAVE_CART' } | { type: 'RETRIEVE_CART' } | { type: 'CLEAR_CART' };


const cartReducer = (state: typeof initialState, action: Action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            if (state.cart.find((product) => product.id === action.payload.id)) {
                const newCart = state.cart.map((product) => {
                    if (product.id === action.payload.id) {
                        return {
                            ...product,
                            quantity: product.quantity + action.payload.quantity,
                        };
                    }
                    return product;
                });

                return {
                    ...state,
                    cart: newCart,
                };
            }

            return {
                ...state,
                cart: [...state.cart, action.payload],
            };


        case 'UPDATE_CART':
            const newCart = state.cart.map((product) => {
                if (product.id === action.payload.id) {
                    return {
                        ...product,
                        quantity: action.payload.quantity,
                    };
                }
                return product;
            });

            return {
                ...state,
                cart: newCart,
            };

        case 'REMOVE_PRODUCT':
            const newCart2 = state.cart.filter((product) => product.id !== action.payload);

            return {
                ...state,
                cart: newCart2,
            };

        case 'SAVE_CART':
            localStorage.setItem('cart', JSON.stringify(state.cart));
            return state;
    
        case 'RETRIEVE_CART':
            const cart = localStorage.getItem('cart');
            if(cart) {
                return {
                    ...state,
                    cart: JSON.parse(cart),
                };
            }

            return state;
        
        case 'CLEAR_CART':
            localStorage.removeItem('cart');
            return {
                ...state,
                cart: [],
            };

        default:
            return state;
    }
};



export const useCartProviderValue = () => {
    const [store, dispatch] = useReducer(
        cartReducer,
        initialState);
    
    useEffect(() => {
        if(typeof window === 'undefined') return;

        dispatch({ type: 'RETRIEVE_CART' });

    }, []);
    
    useEffect(() => {
        if(typeof window === 'undefined') return;

        dispatch({ type: 'SAVE_CART' });

    }, [store.cart]);

    const addToCart = useCallback((orderedProduct: OrderedProduct) => {
        dispatch({
            type: 'ADD_TO_CART',
            payload: orderedProduct,
        });
    }, []);
    

    const updateCart = useCallback((id: string, quantity: number) => {
        dispatch({
            type: 'UPDATE_CART',
            payload: {
                id,
                quantity,
            },
        });
    }, []);


    const removeProduct = useCallback((id: string) => {
        dispatch({
            type: 'REMOVE_PRODUCT',
            payload: id,
        });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({
            type: 'CLEAR_CART',
        });
    }, []);




    return {
        cart: store.cart,
        addToCart,
        updateCart,
        removeProduct,
        clearCart,
    };
};


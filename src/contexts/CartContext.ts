import { createContext, useState, useContext, useCallback } from 'react';
import { OrderedProduct } from '@/types/product';

import { useEffect, useReducer } from 'react';

interface CartContextValue {
    store: {
        cart: OrderedProduct[];
    };
    updateCart: (id: string, quantity: number) => void;
    addToCart: (orderedProduct: OrderedProduct) => void;
    removeProduct: (id: string) => void;
}


const initContextValue: CartContextValue = {
    store: {
        cart: [],
    },
    updateCart: () => {},
    addToCart: () => {},
    removeProduct: () => {},
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

type Action = { type: 'ADD_TO_CART'; payload: OrderedProduct } | { type: 'UPDATE_CART'; payload: { id: string; quantity: number } } | { type: 'REMOVE_PRODUCT'; payload: string };

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

        default:
            return state;
    }
};



export const useCartProviderValue = () => {
    const [store, dispatch] = useReducer(cartReducer, initialState);
    

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



    return {
        store,
        addToCart,
        updateCart,
        removeProduct,
    };
};


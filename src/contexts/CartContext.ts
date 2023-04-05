import { createContext, useState, useContext, useCallback } from 'react';
import { OrderedProduct } from '@/types/product';


interface CartContextValue {
    cart: OrderedProduct[];
    updateCart: (id: string, quantity: number) => void;
    addToCart: (orderedProduct: OrderedProduct) => void;
    removeProduct: (id: string) => void;
}


const CartContext = createContext<CartContextValue | undefined>(undefined);

export default CartContext;


export const useCart = () => {
    const context = useContext(CartContext);

    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
};


export const useCartProviderValue = () => {
    const [cart, setCart] = useState<OrderedProduct[]>([]);



    const addToCart = useCallback((orderedProduct: OrderedProduct) => {
        if (cart.find((product) => product.id === orderedProduct.id)) {
        
            const newCart = cart.map((product) => {
                if (product.id === orderedProduct.id) {
                    return {
                    ...product,
                    quantity: product.quantity + orderedProduct.quantity,
                    };
                }
                return product;
            });
        
            setCart(newCart);
        
            return;
        }
    
        setCart([...cart, orderedProduct]);
    },[cart]);
    

    const updateCart = (id: string, quantity: number) => {
        const newCart = cart.map((product) => {
            if (product.id === id) {
                return {
                    ...product,
                    quantity,
                };
            }
            return product;
        });

        setCart(newCart);   
    };

    const removeProduct = (id: string) => {
        const newCart = cart.filter((product) => product.id !== id);
        setCart(newCart);
    };


    return {
        cart,
        addToCart,
        updateCart,
        removeProduct,
    };
};


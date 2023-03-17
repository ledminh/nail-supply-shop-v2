import { createContext, useState, useContext } from 'react';
import { OrderedProduct } from '@/types/product';

interface CartContextValue {
    addToCart: (orderedProduct: OrderedProduct) => void;
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

    const addToCart = (orderedProduct: OrderedProduct) => {
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
    };

    return {
        cart,
        addToCart,
    };
};


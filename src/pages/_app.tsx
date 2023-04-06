import '@/styles/globals.scss'
import '@styles/customized-quill.scss';

import type { AppProps } from 'next/app'

import  CartContext  from '@contexts/CartContext';
import { useCartProviderValue } from '@contexts/CartContext';



export default function App({ Component, pageProps }: AppProps) {
    
  const cartProviderValue = useCartProviderValue();

  return (
    <CartContext.Provider value={cartProviderValue}>
        <Component {...pageProps} />
    </CartContext.Provider>
  );
}
import '@/styles/globals.scss'
import type { AppProps } from 'next/app'

import  CartContext  from '@contexts/CartContext';
import { useCartProviderValue } from '@contexts/CartContext';
import CategoryContext from '@contexts/CategoryContext';
import { useCategoryProviderValue } from '@contexts/CategoryContext';



export default function App({ Component, pageProps }: AppProps) {
  
  
  const cartProviderValue = useCartProviderValue();
  const categoriesProviderValue = useCategoryProviderValue();


  return (
    <CategoryContext.Provider value={categoriesProviderValue}>
      <CartContext.Provider value={cartProviderValue}>
        <Component {...pageProps} />
      </CartContext.Provider>
    </CategoryContext.Provider>
  )
}

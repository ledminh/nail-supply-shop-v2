import "@/styles/globals.scss";
import "@styles/customized-quill.scss";

import type { AppProps } from "next/app";

import CartContext from "@contexts/CartContext";
import { useCartProviderValue } from "@contexts/CartContext";
import { ClerkProvider } from "@clerk/nextjs";
// import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const cartProviderValue = useCartProviderValue();

  // const {pathname} = useRouter();
  // console.log(pathname);

  return (
    <ClerkProvider {...pageProps}>
      <CartContext.Provider value={cartProviderValue}>
        <Component {...pageProps} />
      </CartContext.Provider>
    </ClerkProvider>
  );
}

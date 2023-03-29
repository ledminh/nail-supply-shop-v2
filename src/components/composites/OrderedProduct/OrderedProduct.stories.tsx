import {  Meta, StoryObj } from "@storybook/react";

import OrderedProduct from '.';
import type { Props } from '.';

import { useState } from "react";
import { OrderedProduct as OrderedProductType} from "@/types/product";

const sampleProduct:OrderedProductType = {
  id: "1",
  name: "Sample Product",
  price: 150,
  quantity: 3,
  image: {
    src: "https://picsum.photos/300/300",
    alt: "sample image",
  }
};


const Wrapper = () => {

  const [product, setProduct] = useState<OrderedProductType>(sampleProduct);

  function onChange({id, quantity}: {id:string, quantity:number}) {
    setProduct({...product, quantity});
  }
  
  return (
    <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexFlow: "column", gap:"20px"}}>
      <OrderedProduct {...product} onChange={onChange}/>
      <div>
        <p>Quantity: {product.quantity}</p>
      </div>
    </div>
  )
}



export default {
  title: "Composites/OrderedProduct",
  component: Wrapper,
} as Meta;


type Story = StoryObj<typeof OrderedProduct>;


export const Default: Story = {};
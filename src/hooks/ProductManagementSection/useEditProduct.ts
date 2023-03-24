import { ProductImage } from "@/types/product";
import { Product, ProductGroup } from "@/types/product";
import axios from "axios";

type Props = {
    setProducts: React.Dispatch<React.SetStateAction<(Product|ProductGroup)[]>>;
    products: (Product|ProductGroup)[];
    setProductModalType: React.Dispatch<React.SetStateAction<'create' | 'edit'|null>>;
    setBeingEditedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
    setIsProductModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function useEditProduct({setProducts, products, setProductModalType, setBeingEditedProduct, setIsProductModalOpen}:Props) {
    const updateProduct = (id: string, serialNumber:string,name :string, intro:string, details:string, price:number, images: (ProductImage|File)[]) => {

        const formData = createFormData({
            id,
            serialNumber,
            name,
            intro,
            details,
            price,
        });

        processImages(images)
            .then((images) => {
                formData.append('images', JSON.stringify(images));
                return axios.post('/api/products?type=update', formData);
            })
            .then((res) => res.data)
            .then((data) => {
                setProducts(products.map((prod) => prod.id === data.id ? data : prod));
            });


    };


    const onEditProduct = (prodID: string) => {
        setProductModalType('edit');
        setBeingEditedProduct(products.find((prod) => prod.id === prodID) as Product);
        setIsProductModalOpen(true);
    }

    return {
        updateProduct,
        onEditProduct,
    };
}

export default useEditProduct;


/*****************************
 * Helper functions
 */

const processImages = (images: (File | ProductImage)[]):Promise<ProductImage[]> => {
    // images can be File[], ProductImage[] or a mixture of both
    // if images are File[], upload them to server, get the filenames, and create ProductImage[]
    // if images are RemoteImage[], just return them

    const files = images.filter((image) => image instanceof File) as File[];
    const productImages = images.filter(
        (image) => !(image instanceof File)
    ) as ProductImage[];

    if (files.length === 0) {
        return Promise.resolve(productImages);
    } else {
        return uploadProductImages(files).then((res) => {
            const filenames = res.data.filenames as string[];
            const newProductImages = filenames.map(
                (filename) => ({
                    // generate a unique id string for each image with Date.now() and Math.random()
                    id: `${Date.now()}-${Math.random()}`,
                    src: `/images/product/${filename}`,
                    alt: filename,
                })
            );
            return [...productImages, ...newProductImages];
        });
    }

}


const uploadProductImages = (images: File[]) => {
    const imageFormData = new FormData();

    
    images.forEach((image) => {
        imageFormData.append('product-images', image);
    });

    return axios.post('/api/upload?type=product-images', imageFormData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}



function createFormData(obj: any) {
    const formData = new FormData();

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            formData.append(key, obj[key].toString());
        }
    }

    return formData;
}
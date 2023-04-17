import {DBProduct} from '@/types/product';
import randomId from '@/utils/randomId';



export default function toDBProduct(product: PrismaProduct): DBProduct {
    const _product = {
        ...product,
        images: product.images.map((image) => ({
            id: randomId(10, "image-"),
            src: image,
            alt: product.name,
        })),
        dateCreated: product.dateCreated.toISOString(),
        lastUpdated: product.lastUpdated.toISOString(),
        groupID: product.groupID || undefined,
    };

    return _product;
}
import styles from "@styles/composites/ProductModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";
import ButtonCPN from "@/components/basics/ButtonCPN";
import ImageCPN from "@/components/basics/ImageCPN";

import { RemoteImage } from "@/types/image";

import { Product, ProductImage } from "@/types/product";

import { useState } from "react";

type onSaveProps = {
    serialNumber: string, 
    name: string, 
    intro: string, 
    details: string, 
    price: number, 
    images: (ProductImage|File)[]
}

export type Props = {
    onSave: (props:onSaveProps) => void;
    onCancel: () => void;
    groupName?: string;
} & ({
    type: "create";
    initSerialNumber?: undefined;
    initName?: undefined;
    initIntro?: undefined;
    initDetails?: undefined;
    initPrice?: undefined;
    initImages?: undefined;

} | {
    type: "edit";
    initSerialNumber: string;
    initName: string;
    initIntro: string;
    initDetails: string;
    initPrice: number;
    initImages: ProductImage[];
})
    

export default function ProductModal({ type, onSave, onCancel, groupName, initSerialNumber, initName, initIntro, initDetails, initPrice, initImages
}: Props) {

    const [serialNumber, setSerialNumber] = useState(initSerialNumber ?? "");
    const [name, setName] = useState(initName ?? "");
    const [intro, setIntro] = useState(initIntro ?? "");
    const [details, setDetails] = useState(initDetails ?? "");
    const [price, setPrice] = useState(initPrice ?? 0);
    const [images, setImages] = useState<(ProductImage|File)[]|null>(initImages ?? null);

    const _onSave = () => {
        if(!serialNumber || !name || !intro || !details || price === 0 || !images || images.length === 0) return;

        
        onSave({
            serialNumber, name, intro, details, price, images
        });
    };


    const FooterComponent = () => {
        return (
            <fieldset className={styles.footer}>
                <ButtonCPN type="normal" 
                    label={type === 'edit'? 'Save' : 'Add'} 
                    disabled = {!serialNumber || !name || !intro || !details || price === 0 || !images || images.length === 0} 
                    onClick={_onSave}/>
                <ButtonCPN type="attention" 
                    label="Cancel" 
                    onClick={onCancel}/>
            </fieldset>
        );
    };

    const title = type === 'edit'? 'Edit Product' : 'Add Product';
    
    return (
        <ModalLayout title={title} FooterComponent={FooterComponent} type="normal">
            <form className={styles.form}>
                <fieldset className={styles.fieldset}>
                    <legend>Info</legend>
                    {
                        groupName && 
                        (<div className={styles.groupName}>
                            <div className={styles.label}>GROUP:</div>
                            <div className={styles.value}>{groupName}</div>
                        </div>)
                    }                    
                    <div className={styles.formGroup}>
                        <label htmlFor="serialNumber">Serial #</label>
                        <input type="text" id="serialNumber" value={serialNumber} onChange={(e) => {
                            const value = e.target.value;
                            if(value.length > 10) return;
                            const intVal = parseInt(value);

                            if(isNaN(intVal) || intVal < 0) return;

                            setSerialNumber(value);
                        }}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="intro">Intro</label>
                        <input type="text "id="intro" value={intro} onChange={(e) => setIntro(e.target.value)}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="details">Details</label>
                        <textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="price">Price</label>
                        <input type="number" id="price" value={price} onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if(isNaN(value) || value < 0) return;

                            setPrice(value);
                        }}/>
                    </div>
                </fieldset>
                <div className={styles.imagesHeader}>
                    <h4>Images</h4>
                </div>
                <div className={styles.images}>
                    <div key="add-image" className={styles.imageBlock}>
                        <label htmlFor="image">Add Image</label>
                        <input type="file" id="image" onChange={(e) => {
                            if(!e.target.files?.[0]) return;

                            const newImage = e.target.files[0];
                            setImages((prev) => prev? [newImage, ...prev ] : [newImage]);
                        }}/>
                    </div>
                    {
                        images && images.map((image) => (
                            <button className={styles.imageBlock}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setImages((prev) => prev? prev.filter((img) => img !== image): null);
                                }}
                            >
                                <ImageCPN
                                    key={createImageObj(image).alt} 
                                    image = {createImageObj(image)} 
                                    size = "small"
                                    className={styles.image}
                                />
                            </button>
                            ))
                    }
                </div>
            </form>
        </ModalLayout>
    );
}

ProductModal.displayName = "ProductModal";

const createImageObj = (image: RemoteImage | File) => {
    if(image instanceof File) return {
        src: URL.createObjectURL(image),
        alt: image.name
    };

    return image;
}


export type OpenEditProductProps = {
    product: Product;
    onSave: (props:onSaveProps) => void;
    onCancel: () => void;
}

export function useProductModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<"create" | "edit">("create");
    const [groupName, setGroupName] = useState<string | null>(null);
    const [initSerialNumber, setInitSerialNumber] = useState<string | null>(null);
    const [initName, setInitName] = useState<string | null>(null);
    const [initIntro, setInitIntro] = useState<string | null>(null);
    const [initDetails, setInitDetails] = useState<string | null>(null);
    const [initPrice, setInitPrice] = useState<number | null>(null);
    const [initImages, setInitImages] = useState<ProductImage[] | null>(null);

    const [onSave, setOnSave] = useState<(props: onSaveProps) => void>(() => () => {});
    const [onCancel, setOnCancel] = useState<() => void>(() => () => {});

    // const openCreateSingleProduct = ({
    //     beforeOpen = () => {},
    //     onOK = () => {},
    //     onCancel = () => {}
    // }) => {
    //     beforeOpen();
    //     setOnOK(onOK);
    //     setOnCancel(onCancel);
    //     setType("create");
    //     setIsOpen(true);
    // };




    const openEditProduct = ({product, onSave, onCancel}: OpenEditProductProps) => {
        setIsOpen(true);
        setType("edit");
        product.groupName && setGroupName(product.groupName);
        setInitSerialNumber(product.id);
        setInitName(product.name);
        setInitIntro(product.intro);
        setInitDetails(product.details);
        setInitPrice(product.price);
        setInitImages(product.images);

        setOnSave(onSave);
        setOnCancel(onCancel);
    };

    const close = () => {
        setIsOpen(false);
        setGroupName(null);
        setInitSerialNumber(null);
        setInitName(null);
        setInitIntro(null);
        setInitDetails(null);
        setInitPrice(null);
        setInitImages(null);

        setOnSave(() => () => {});
        setOnCancel(() => () => {});
    };


    const ProductModalComponent = () => {
        return (
            <>
                {
                    isOpen && (
                        type === "edit"?
                        <ProductModal
                            type="edit"
                            groupName={groupName?? undefined}
                            initSerialNumber={initSerialNumber!}
                            initName={initName!}
                            initIntro={initIntro!}
                            initDetails={initDetails!}
                            initPrice={initPrice!}
                            initImages={initImages!}
                            onCancel={() => {
                                onCancel();
                                close();
                            }}
                            onSave={(props) => {
                                onSave(props);
                                close();
                            }}
                        /> : null

                    )

                }
            </>
        );

    };



    return {
        // openCreate,
        openEditProduct,
        close,
        ProductModalComponent
    };


}
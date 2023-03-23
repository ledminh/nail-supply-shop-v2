import styles from "@styles/composites/ProductModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";
import ButtonCPN from "@/components/basics/ButtonCPN";
import ImageCPN from "@/components/basics/ImageCPN";

import { RemoteImage } from "@/types/image";

import { useState } from "react";

type onSaveProps = {
    serialNumber: string, 
    name: string, 
    intro: string, 
    details: string, 
    price: number, 
    images: (RemoteImage|File)[]
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
    initImages: RemoteImage[];
})
    

export default function ProductModal({ type, onSave, onCancel, groupName, initSerialNumber, initName, initIntro, initDetails, initPrice, initImages
}: Props) {

    const [serialNumber, setSerialNumber] = useState(initSerialNumber ?? "");
    const [name, setName] = useState(initName ?? "");
    const [intro, setIntro] = useState(initIntro ?? "");
    const [details, setDetails] = useState(initDetails ?? "");
    const [price, setPrice] = useState(initPrice ?? 0);
    const [images, setImages] = useState<(RemoteImage|File)[]|null>(initImages ?? null);

    const _onSave = () => {
        if(!serialNumber || !name || !intro || !details || price === 0 || !images) return;

        
        onSave({
            serialNumber, name, intro, details, price, images
        });
    };


    const FooterComponent = () => {
        return (
            <fieldset className={styles.footer}>
                <ButtonCPN type="normal" 
                    label={type === 'edit'? 'Save' : 'Add'} 
                    disabled = {!serialNumber || !name || !intro || !details || price === 0 || !images} 
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
                        (<div className={styles.formGroup}>
                            <div className={styles.label}>GROUP</div>
                            <div className={styles.value}>{groupName}</div>
                        </div>)
                    }                    
                    <div className={styles.formGroup}>
                        <label htmlFor="serialNumber">Serial #</label>
                        <input type="text" id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)}/>
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
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(Number(e.target.value))}/>
                    </div>
                </fieldset>
                <div className={styles.imageHeader}>
                    <h4>Image</h4>
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
import styles from "@styles/composites/ProductModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";
import ButtonCPN from "@/components/basics/ButtonCPN";
import ImageCPN from "@/components/basics/ImageCPN";

import { RemoteImage } from "@/types/image";

import { useState } from "react";

type onSaveProps = {
    name: string,
    description: string,
    image: RemoteImage | File
}

// export type Props = {
//     onSave: ({ name, description, image }:onSaveProps) => void;
//     onCancel: () => void;
// } & ({
//     type: "create";
//     initName?: undefined;
//     initDescription?: undefined;
//     initImage?: undefined 

// } | {
//     type: "edit";
//     initName: string;
//     initDescription: string;
//     initImage: RemoteImage;
// })
    
export type Props = {};

export default function CategoryModal({ type, onSave, onCancel, initName, initDescription, initImage }: Props) {

    // const [name, setName] = useState(initName ?? "");
    // const [description, setDescription] = useState(initDescription ?? "");
    // const [image, setImage] = useState<RemoteImage|File|null>(initImage ?? null);

    const _onSave = () => {
        // if(!name || !description || !image) return;

        
        // onSave({
        //     name,
        //     description,
        //     image
        // });
    };


    // const FooterComponent = () => {
    //     return (
    //         <fieldset className={styles.footer}>
    //             <ButtonCPN type="normal" label={type === 'edit'? 'Save' : 'Add'} disabled = {!name || !description || !image} onClick={_onSave}/>
    //             <ButtonCPN type="attention" label="Cancel" onClick={onCancel}/>
    //         </fieldset>
    //     );
    // };

    // const title = type === 'edit'? 'Edit Category' : 'Add Category';
    
    return (
        <ModalLayout title={title} FooterComponent={FooterComponent} type="normal">
            <form className={styles.form}>
                <fieldset className={styles.fieldset}>
                    <legend>Info</legend>
                    <div className={styles.formGroup}>
                        <div className={styles.label}>GROUP</div>
                        <div className={styles.value}>{groupName}</div>
                    </div>                    
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
                        <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)}/>
                    </div>
                </fieldset>
                <div className={styles.imageHeader}>
                    <h4>Image</h4>
                    {/* <label htmlFor="image">{image? "Replace": "Add Image"}</label>
                    <input type="file" id="image" onChange={(e) => setImage(e.target.files?.[0] ?? null)}/> */}
                </div>
                <div className={styles.images}>
                    <div key="add-image" className={styles.imageBlock}>
                        <label htmlFor="image">Add Image</label>
                        <input type="file" id="image" onChange={(e) => setImage(e.target.files?.[0] ?? null)}/>
                    </div>
                    {
                        images.map((image) => (
                            <ImageCPN
                                key={createImageObj(image).alt} 
                                image = {createImageObj(image)} 
                                size = "small"
                                className={styles.imageBlock}
                            />))
                    }
                </div>
            </form>
        </ModalLayout>
    );
}

CategoryModal.displayName = "CategoryModal";

const createImageObj = (image: RemoteImage | File) => {
    if(image instanceof File) return {
        src: URL.createObjectURL(image),
        alt: image.name
    };

    return image;
}
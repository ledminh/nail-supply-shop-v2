import styles from "@styles/composites/CategoryModal.module.scss";
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

export type Props = {
    onSave: ({ name, description, image }:onSaveProps) => void;
    onCancel: () => void;
} & ({
    type: "create";
    initName?: undefined;
    initDescription?: undefined;
    initImage?: undefined 

} | {
    type: "edit";
    initName: string;
    initDescription: string;
    initImage: RemoteImage;
})
    

export default function CategoryModal({ type, onSave, onCancel, initName, initDescription, initImage }: Props) {

    const [name, setName] = useState(initName ?? "");
    const [description, setDescription] = useState(initDescription ?? "");
    const [image, setImage] = useState<RemoteImage|File|null>(initImage ?? null);

    const _onSave = () => {
        if(!name || !description || !image) return;

        onSave({
            name,
            description,
            image
        });
    };


    const FooterComponent = () => {
        return (
            <fieldset className={styles.footer}>
                <ButtonCPN type="normal" label={type === 'edit'? 'Save' : 'Add'} disabled = {!name || !description || !image} onClick={_onSave}/>
                <ButtonCPN type="attention" label="Cancel" onClick={onCancel}/>
            </fieldset>
        );
    };

    return (
        <ModalLayout title="Category" FooterComponent={FooterComponent}>
            <form className={styles.form}>
                <fieldset className={styles.fieldset}>
                    <legend>Info</legend>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <input type="text "id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                    </div>
                </fieldset>
                <div className={styles.imageHeader}>
                    <h4>Image</h4>
                    <label htmlFor="image">{image? "Replace": "Add Image"}</label>
                    <input type="file" id="image" onChange={(e) => setImage(e.target.files?.[0] ?? null)}/>
                </div>
                {
                    <div className={styles.imageWrapper}>
                        {
                            image && <ImageCPN 
                                            image = {createImageObj(image)} 
                                            size = "medium"
                                            className={styles.image}
                                        />
                        }
                        <span>No image selected</span>
                    </div>
                }
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
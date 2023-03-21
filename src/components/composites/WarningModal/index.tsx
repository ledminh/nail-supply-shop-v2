import styles from "@styles/composites/WarningModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";
import ButtonCPN from "@/components/basics/ButtonCPN";





export type Props = {
    onOK: () => void;
    onCancel: () => void;
    message: string;
}; 
    

export default function WarningModal({ onOK, onCancel, message }: Props) {



    const FooterComponent = () => {
        return (
            <fieldset className={styles.footer}>
                <ButtonCPN type="normal" label="OK" onClick={onOK}/>
                <ButtonCPN type="attention" label="Cancel" onClick={onCancel}/>
            </fieldset>
        );
    };

    
    return (
        <ModalLayout title={"Warning"} FooterComponent={FooterComponent} type="warning">
            <p className={styles.message}>{message}</p>
        </ModalLayout>
    );
}

WarningModal.displayName = "WarningModal";
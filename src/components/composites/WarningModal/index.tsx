import styles from "@styles/composites/WarningModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";
import ButtonCPN from "@/components/basics/ButtonCPN";

import { useState } from "react";




export type Props = {
    onOK: () => void;
    onCancel: () => void;
    message: string;
}; 
    

function WarningModal({ onOK, onCancel, message }: Props) {



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

export default WarningModal;

export type ShowWarningProps = {
    message: string;
    beforeWarning?: () => void;
    onOK?: () => void;
    onCancel?: () => void;
};


export function useWarningModal() {
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    const [onOK, setOnOK] = useState(() => () => {});
    const [onCancel, setOnCancel] = useState(() => () => {});



    const showWarning = ({ beforeWarning, message,  onOK, onCancel}:ShowWarningProps)=> {
        beforeWarning && beforeWarning();
        setOnOK(() => onOK || (() => {}));
        setOnCancel(() => onCancel || (() => {}));
        setWarningMessage(message);
        setShowWarningModal(true);
    }

    const hideWarning = () => {
        setShowWarningModal(false);
    }

    const WarningModalComponent = () => {
        return (
            <>
                {
                    showWarningModal &&             
                    <WarningModal 
                            message={warningMessage}
                            onOK={() => {
                                onOK();
                                hideWarning();
                            }}
                            onCancel={() => {
                                onCancel();
                                hideWarning();
                            }}
                        />
                }
            </>
        );
    }

    return {
        showWarning,
        WarningModalComponent
    }
}



import styles from "@styles/composites/CategoryModal.module.scss";
import ModalLayout from "@/components/layouts/ModalLayout";

export interface Props {
}


export default function CategoryModal({ }: Props) {


    return (
        <ModalLayout title="Category" FooterComponent={() => <div>Footer</div>}>
            CategoryModal composite
        </ModalLayout>
    );
}

CategoryModal.displayName = "CategoryModal";
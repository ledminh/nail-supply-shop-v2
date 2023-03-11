import styles from "@styles/composites/templatename.module.scss";

export interface Props {
}


export default function templatename({ }: Props) {


    return (
        <div className={styles.placeholder}>
            TemplateName composite
        </div>
    );
}

templatename.displayName = "templatename";
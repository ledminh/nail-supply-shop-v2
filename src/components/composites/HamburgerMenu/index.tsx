import styles from "@styles/composites/HamburgerMenu.module.scss";

import ButtonCPN from "@components/basics/ButtonCPN";
import ImageCPN from "@/components/basics/ImageCPN";
import hamburgerIconSVG from "@images/hamburger_icon.svg";

export interface Props {
}


export default function HamburgerMenu({ }: Props) {


    return (
        <div className={styles.wrapper}>
            <ButtonCPN 
                type="normal" 
                label="Menu" 
                icon = {{
                    position: "left",
                    Node: <HamburgerIcon />  
                }}
                />
        </div>
    );
}

HamburgerMenu.displayName = "HamburgerMenu";

const HamburgerIcon = () => {

    return (
        <ImageCPN 
            image={{
                src: hamburgerIconSVG,
                alt: "Hamburger Icon",
            }}
            size="small"
            className={styles.hamburgerIcon}
        />
    );
}
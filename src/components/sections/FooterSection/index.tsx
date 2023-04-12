import ImageCPN from "@/components/basics/ImageCPN";
import AboutBlock from "@/components/composites/AboutBlock";
import ContactBlock from "@/components/composites/ContactBlock";
import styles from "@styles/sections/FooterSection.module.scss";
import { LocalImage } from "@/types/image";
import { ContactInfo } from "@/types/others";

export interface Props {
  contactInfo: ContactInfo;
  aboutText: string;
  logoImg: LocalImage;
}

export default function FooterSection({
  contactInfo,
  aboutText,
  logoImg,
}: Props) {
  const { email, phone, additionalInfos } = contactInfo;

  return (
    <section className={styles.wrapper}>
      <div className={styles.block}>
        <AboutBlock text={aboutText} />
      </div>
      <div className={styles.block}>
        <ContactBlock
          email={email}
          phone={phone}
          additionalInfos={additionalInfos ? additionalInfos : []}
        />
      </div>
      <div className={styles.block}>
        <ImageCPN image={logoImg} size="medium" className={styles.logo} />
      </div>
    </section>
  );
}

FooterSection.displayName = "FooterSection";

import { ContactInfo } from '@/types/others';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/About.module.scss'
import type { AboutUsData } from '@/types/others';
import {getAboutUsData} from '@/database';


export interface Props {
  errorMessage?: string,
  aboutUsData: AboutUsData
};


export default function AboutPage({errorMessage, aboutUsData }:Props) {
  
  if(errorMessage) {
    throw new Error(errorMessage);
  }
  
  return (
    <PageLayout
      contactInfo = {aboutUsData.contactInfo}
      aboutText = {aboutUsData.aboutUsFooter}
    >
      <div className={styles.wrapper}>
        <section className={styles.missionStatement}>
          <h2 className={styles.title}>Mission Statement</h2>
          <p className={styles.text}>{aboutUsData.missionStatement}</p>
        </section>
        <section className={styles.history}>
          <h2 className={styles.title}>History</h2>
          <div className={styles.text} dangerouslySetInnerHTML={{__html: aboutUsData.historyHTML}} />
        </section>
        <section className={styles.contactUs}>
          <h2 className={styles.title}>Contact Us</h2>
          <p className={styles.text}>If you have any questions or feedback, please feel free to contact us using the information below:</p>
          <div className={styles.contactInfo}>
            <p className={styles.text}><strong>Email:</strong> {aboutUsData.contactInfo.email}</p>
            <p className={styles.text}><strong>Phone:</strong> {aboutUsData.contactInfo.phone}</p>
            {
              aboutUsData.contactInfo.additionalInfos && (
                aboutUsData.contactInfo.additionalInfos.map((info, index) => (
                <p key={info} className={styles.text}>{info}</p>
              )))
            }
          </div>          
        </section>
      </div>
    </PageLayout>
  )
}

AboutPage.displayName = "AboutPage";

export const getServerSideProps = async () => {
 


  try {
    const aboutUsRes = await getAboutUsData();

    if(!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message
        }
      }
    }

    return {
      props: {
        aboutUsData: aboutUsRes.data
      }
    }
  }
  catch (err:any) {
    return {
      props: {
        errorMessage: err.message
      }
    }
  }

  
}



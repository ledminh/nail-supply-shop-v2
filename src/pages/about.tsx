import { ContactInfo } from '@/types/others';

import PageLayout from '@/components/layouts/PageLayout'

import styles from '@/styles/pages/About.module.scss'
import type { AboutUsData } from '@/types/others';
import {getAboutUsData} from '@/database';


export interface Props {
  contactInfo: ContactInfo,
  aboutTextFooter: string,
  aboutUsData: AboutUsData
};


export default function AboutPage({contactInfo, aboutTextFooter, aboutUsData }:Props) {

  
  return (
    <PageLayout
      contactInfo = {contactInfo}
      aboutText = {aboutTextFooter}
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
          <p className={styles.text}><strong>Email:</strong> {aboutUsData.contactInfo.email}</p>
          <p className={styles.text}><strong>Phone:</strong> {aboutUsData.contactInfo.phone}</p>
          {
            aboutUsData.contactInfo.additionalInfos && (
              aboutUsData.contactInfo.additionalInfos.map((info, index) => (
              <p key={info} className={styles.text}>{info}</p>
            )))
          }
        </section>
      </div>
    </PageLayout>
  )
}

AboutPage.displayName = "AboutPage";

export const getServerSideProps = async () => {
  
  const aboutTextFooter = "Nail Essential is a family-owned business that has been providing high-quality nail care products to professionals and enthusiasts for over 20 years. Our mission is to make it easy for our customers to find the products they need to create beautiful and healthy nails. We take pride in offering a wide selection of top-quality products, competitive pricing, and exceptional customer service. Thank you for choosing Nail Essential for all of your nail care needs."

const contactInfo:ContactInfo = {
    email: "customer.service@example.com",
    phone: "1-800-555-5555",
    additionalInfos: [
        "Monday - Friday: 9:00am - 5:00pm EST",
        "Saturday: 10:00am - 2:00pm EST",
        "Sunday: Closed"
    ]
}

const dbRes = await getAboutUsData();

if(!dbRes.success) 
  throw new Error("Error while fetching data from database");



  return {
    props: {
      contactInfo,
      aboutTextFooter,
      aboutUsData: dbRes.data
    }
  }
}



import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ContactInfo } from '@/types/others';
import PageLayout from '@/components/layouts/PageLayout';
import TabLayout from '@/components/layouts/TabLayout';

import { adminConfig } from '@/config';

interface Props {
  contactInfo: ContactInfo;
  aboutTextFooter: string;
}





export default function AdminPage(props: Props) {
  const { contactInfo, aboutTextFooter } = props;
  const router = useRouter();
  let { section_slug } = router.query;


  if (typeof section_slug !== 'string') {
    return <div>Invalid section</div>;
  }

  const { sections } = adminConfig;
  
  
  const section = sections.find((s) => s.slug === section_slug);


  if (!section) {
    return <div>Invalid section</div>;
  }

  const { component: SectionComponent } = section;

  return (
    <PageLayout contactInfo={contactInfo} aboutText={aboutTextFooter}>
      <TabLayout tabs={sections} currentTabSlug={section_slug}>
        <SectionComponent />
      </TabLayout>
    </PageLayout>
  );
}

AdminPage.displayName = 'AdminPage';

export const getServerSideProps:GetServerSideProps<Props> = async (context) => {  


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


  return {
    props: {
      contactInfo,
      aboutTextFooter,

    }
  }
}
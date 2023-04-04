import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { ContactInfo } from '@/types/others';
import PageLayout from '@/components/layouts/PageLayout';
import TabLayout from '@/components/layouts/TabLayout';

import { adminConfig } from '@/config';
import { getAboutUsData } from '@/database';

export interface Props {
  errorMessage?: string,

  contactInfo: ContactInfo;
  aboutUsFooter: string;
}

export default function AdminPage(props: Props) {
  const { errorMessage, contactInfo, aboutUsFooter } = props;

  if (errorMessage) {
    throw new Error(errorMessage);
  }


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
    <PageLayout contactInfo={contactInfo} aboutText={aboutUsFooter}>
      <TabLayout tabs={sections} currentTabSlug={section_slug}>
        <SectionComponent />
      </TabLayout>
    </PageLayout>
  );
}

AdminPage.displayName = 'AdminPage';

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

    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo;
    
    return {
      props: {
        contactInfo,
        aboutUsFooter,
        
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
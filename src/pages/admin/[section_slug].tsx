import { useRouter } from "next/router";
import { ContactInfo } from "@/types/others";
import PageLayout from "@/components/layouts/PageLayout";
import TabLayout from "@/components/layouts/TabLayout";

import styles from "@/styles/pages/Admin.module.scss";

import { adminConfig } from "@/config";
import { getAboutUsData } from "@/database";

import { UserButton } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";


export interface Props {
  errorMessage?: string;
  unauthorizedLogin?: boolean;
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

  if (typeof section_slug !== "string") {
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
        <section className={styles.adminAccount}>
          <UserButton/>
          <h3>ACCOUNT</h3>
        </section>
        {
          props.unauthorizedLogin ? 
          (
          <div className={styles.unauthorizedLogin}>
            <h3>Unauthorized Login</h3>
            <p>You are not authorized to access this page.</p>
          </div>
          ) : (
            <TabLayout tabs={sections} currentTabSlug={section_slug}>
                <SectionComponent />
            </TabLayout>
          )
        }
    </PageLayout>
  );
}

AdminPage.displayName = "AdminPage";


export const getServerSideProps =  async (context:GetServerSidePropsContext) => {
  

  
  try {
    const aboutUsRes = await getAboutUsData();

    if (!aboutUsRes.success) {
      return {
        props: {
          errorMessage: aboutUsRes.message,
        },
      };
    }

    const aboutUsFooter = aboutUsRes.data!.aboutUsFooter;
    const contactInfo = aboutUsRes.data!.contactInfo; 


    
    // Admin verification
    const {userId} = getAuth(context.req);
    const unauthorizedLogin = !userId || userId !== process.env.ADMIN_ID;
    

    return {
      props: {
        contactInfo,
        aboutUsFooter,
        unauthorizedLogin
      },
    };
  } catch (err: any) {
    return {
      props: {
        errorMessage: err.message,
      },
    };
  }
};

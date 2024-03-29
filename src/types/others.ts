import { LocalImage } from "./image";

export type WebsiteTitle =
  | {
      title: string;
      subtitle: string;
      image?: undefined;
      alt?: undefined;
    }
  | {
      title?: undefined;
      subtitle?: undefined;
      image: LocalImage;
      alt: string;
    };

export type ContactInfo = {
  email: string;
  phone: string;
  additionalInfos?: string[];
};

export type AdminSection = {
  id: string;
  name: string;
  slug: string;
  component: React.FC;
};

export type AboutUsData = {
  aboutUsFooter: string;
  missionStatement: string;
  historyHTML: string;
  contactInfo: ContactInfo;
};

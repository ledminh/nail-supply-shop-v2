import type { AboutUsData, ContactInfo } from "@/types/others";

import prismaClient from "./utils/prismaClient";
import { AboutUs } from "@prisma/client";

export type GetAboutUsDataResponse =
  | {
      success: true;
      data: AboutUsData;
    }
  | {
      success: false;
      message: string;
    };

export function getAboutUsData(): Promise<GetAboutUsDataResponse> {
  return new Promise((resolve, reject) => {
    
    const _getAboutUsData = async () => {
      const aboutUsPromise = await prismaClient.aboutUs.findUnique({
        where: {
          id: "about-us",
        },
      });

      const contactInfoPromise = await prismaClient.contactInfo.findUnique({
        where: {
          id: "contact-info",
        }
      });

      let [aboutUs, contactInfo] = await Promise.all([aboutUsPromise, contactInfoPromise]);

      let newAboutUs, newContactInfo;

      if (!aboutUs) {

        aboutUs = await prismaClient.aboutUs.create({
          data: {
            id: "about-us",
            aboutUsFooter: "",
            missionStatement: "",
            historyHTML: "",
          },
        }); 

        if(!aboutUs) {
          reject({
            success: false,
            message: "Error creating about us data",
          });
        }
      }


      if (!contactInfo) {

        contactInfo = await prismaClient.contactInfo.create({
          data: {
            id: "contact-info",
            email: "",
            phone: "",
            aboutUsId: "about-us",
          },
        });

        if(!contactInfo) {
          reject({
            success: false,
            message: "Error creating contact info data",
          });
        }
      }



      resolve({
        success: true,
        data: {
          ...aboutUs,
          contactInfo,
        },
      });
    }
    
    _getAboutUsData().catch((err) => {
      reject({
        success: false,
        message: err.message,
      });
    });
      
  });
}

export type SetAboutUsFooterProps = {
  footer: string;
};

export type SetAboutUsFooterResponse =
  | {
      success: true;
      data: string;
    }
  | {
      success: false;
      message: string;
    };

export function setAboutUsFooter({
  footer,
}: SetAboutUsFooterProps): Promise<SetAboutUsFooterResponse> {
  return new Promise((resolve, reject) => {
    const _setAboutUsFooter = async () => {
      const aboutUs = await prismaClient.aboutUs.findUnique({
        where: {
          id: "about-us",
        },
      });

      const action = aboutUs
      ? prismaClient.aboutUs.update({
                                      where: {
                                        id: "about-us",
                                      },
                                      data: {
                                        aboutUsFooter: footer,
                                      },
                                    })
      : prismaClient.aboutUs.create({
                                      data: { 
                                        id: "about-us",
                                        aboutUsFooter: footer,
                                        missionStatement: "",
                                        historyHTML: "",
                                      },
                                    });

      await action;

      resolve({
        success: true,
        data: footer,
      });
    }

    _setAboutUsFooter().catch((err) => {
      reject({
        success: false,
        message: err.message,
      });
    });
  });
}

export type SetAboutUsMissionStatementProps = {
  missionStatement: string;
};

export type SetAboutUsMissionStatementResponse =
  | {
      success: true;
      data: string;
    }
  | {
      success: false;
      message: string;
    };

export function setAboutUsMissionStatement({
  missionStatement,
}: SetAboutUsMissionStatementProps): Promise<SetAboutUsMissionStatementResponse> {
  return new Promise((resolve, reject) => {
    const _setAboutUsMissionStatement = async () => {
      const aboutUs = await prismaClient.aboutUs.findUnique({
        where: {
          id: "about-us",
        },
      });

      const action = aboutUs
      ? prismaClient.aboutUs.update({
                                      where: {
                                        id: "about-us",
                                      },
                                      data: {
                                        missionStatement: missionStatement,
                                      },
                                    })

      : prismaClient.aboutUs.create({
                                      data: {
                                        id: "about-us",
                                        aboutUsFooter: "",
                                        missionStatement: missionStatement,
                                        historyHTML: "",
                                      },
                                    });

      await action;

      resolve({
        success: true,
        data: missionStatement,
      });
    }

    _setAboutUsMissionStatement().catch((err) => {
      reject({
        success: false,
        message: err.message,
      });
    });
  });
}

export type SetAboutUsHistoryHTMLProps = {
  history: string;
};

export type SetAboutUsHistoryHTMLResponse =
  | {
      success: true;
      data: string;
    }
  | {
      success: false;
      message: string;
    };

export function setAboutUsHistoryHTML({
  history,
}: SetAboutUsHistoryHTMLProps): Promise<SetAboutUsHistoryHTMLResponse> {
  return new Promise((resolve, reject) => {
    const _setAboutUsHistoryHTML = async () => {
      const aboutUs = await prismaClient.aboutUs.findUnique({
        where: {
          id: "about-us",
        },
      });

      const action = aboutUs
      ? prismaClient.aboutUs.update({
                                      where: {
                                        id: "about-us",
                                      },
                                      data: {
                                        historyHTML: history,
                                      },
                                    }) 
      : prismaClient.aboutUs.create({
                                      data: {
                                        id: "about-us",
                                        aboutUsFooter: "",
                                        missionStatement: "",
                                        historyHTML: history,
                                      },
                                    });
      

      await action;

      return resolve({ success: true, data: history });
    }

    _setAboutUsHistoryHTML().catch((err) => {
      reject({
        success: false,
        message: err.message,
      });
    });
  });
}

export type SetAboutUsContactInfoProps = {
  contactInfo: ContactInfo;
};

export type SetAboutUsContactInfoResponse =
  | {
      success: true;
      data: ContactInfo;
    }
  | {
      success: false;
      message: string;
    };

export function setAboutUsContactInfo({
  contactInfo,
}: SetAboutUsContactInfoProps): Promise<SetAboutUsContactInfoResponse> {
  return new Promise((resolve, reject) => {
    const _setAboutUsContactInfo = async () => {
      const dbContactInfo = await prismaClient.contactInfo.findUnique({
        where: {
          id: "contact-info",
        },
      });

      if (!dbContactInfo) {
        const aboutUs = await prismaClient.aboutUs.findUnique({ where: { id: "about-us"} });

        if (!aboutUs) {
          await prismaClient.aboutUs.create({
            data: {
              id: "about-us",
              aboutUsFooter: "",
              missionStatement: "",
              historyHTML: "",
            },
          });
        }

        await prismaClient.contactInfo.create({
          data: {
            ...contactInfo,
            aboutUs: {
              connect: {
                id: "about-us",
              },
            },
          }
        });


        return resolve({ success: true, data: contactInfo });
      }
      else {
        await prismaClient.contactInfo.update({
          where: {
            id: "contact-info",
          },
          data: {
            ...contactInfo,
          },
        });
  
        return resolve({ success: true, data: contactInfo });
      }
    }

    _setAboutUsContactInfo().catch((err) => {
      reject({
        success: false,
        message: err.message,
      });
    });
  });
}

import type { AboutUsData, ContactInfo } from "@/types/others";
import { getDB } from "../jsons";

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
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No data found in database",
        });
      }

      const { ABOUT_US } = data;

      if (!ABOUT_US) {
        reject({
          success: false,
          message: "No about us data found in database",
        });
      }

      resolve({
        success: true,
        data: ABOUT_US,
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
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No data found in database",
        });
      }

      const { ABOUT_US } = data;

      if (!ABOUT_US) {
        reject({
          success: false,
          message: "No about us data found in database",
        });
      }

      ABOUT_US.aboutUsFooter = footer;

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No data found in database",
            });
          }

          const { ABOUT_US } = db.data;

          if (!ABOUT_US) {
            reject({
              success: false,
              message: "No about us data found in database",
            });
          }

          resolve({
            success: true,
            data: ABOUT_US.aboutUsFooter,
          });
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
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No data found in database",
        });
      }

      const { ABOUT_US } = data;

      if (!ABOUT_US) {
        reject({
          success: false,
          message: "No about us data found in database",
        });
      }

      ABOUT_US.missionStatement = missionStatement;

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No data found in database",
            });
          }

          const { ABOUT_US } = db.data;

          if (!ABOUT_US) {
            reject({
              success: false,
              message: "No about us data found in database",
            });
          }

          resolve({
            success: true,
            data: ABOUT_US.missionStatement,
          });
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
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No data found in database",
        });
      }

      const { ABOUT_US } = data;

      if (!ABOUT_US) {
        reject({
          success: false,
          message: "No about us data found in database",
        });
      }

      ABOUT_US.historyHTML = history;

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No data found in database",
            });
          }

          const { ABOUT_US } = db.data;

          if (!ABOUT_US) {
            reject({
              success: false,
              message: "No about us data found in database",
            });
          }

          resolve({
            success: true,
            data: ABOUT_US.historyHTML,
          });
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
    getDB().then((db) => {
      const { data } = db;

      if (!data) {
        return reject({
          success: false,
          message: "No data found in database",
        });
      }

      const { ABOUT_US } = data;

      if (!ABOUT_US) {
        reject({
          success: false,
          message: "No about us data found in database",
        });
      }

      ABOUT_US.contactInfo = contactInfo;

      db.write()
        .then(() => db.read())
        .then(() => {
          if (!db.data) {
            return reject({
              success: false,
              message: "No data found in database",
            });
          }

          const { ABOUT_US } = db.data;

          if (!ABOUT_US) {
            reject({
              success: false,
              message: "No about us data found in database",
            });
          }

          resolve({
            success: true,
            data: ABOUT_US.contactInfo,
          });
        });
    });
  });
}

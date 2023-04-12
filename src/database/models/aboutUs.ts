import aboutUsJSON from "../jsons/aboutUs.json";
import type { AboutUsData } from "@/types/others";

const aboutUs = aboutUsJSON as AboutUsData;

type Response =
  | {
      success: true;
      message?: string;
      data?: AboutUsData;
    }
  | {
      success: false;
      message: string;
      data?: undefined;
    };

export function getAboutUsData(): Promise<Response> {
  return Promise.resolve({ success: true, data: aboutUs });
}

export function setAboutUsFooter(footer: string) {
  aboutUs.aboutUsFooter = footer;

  return Promise.resolve({
    success: true,
    message: "About us footer updated successfully",
  });
}

export function setAboutUsMissionStatement(missionStatement: string) {
  aboutUs.missionStatement = missionStatement;

  return Promise.resolve({
    success: true,
    message: "Mission statement updated successfully",
  });
}

export function setAboutUsHistoryHTML(history: string) {
  aboutUs.historyHTML = history;

  return Promise.resolve({
    success: true,
    message: "History updated successfully",
  });
}

export function setAboutUsContactInfo(
  email: string,
  phone: string,
  additionalInfos?: string[]
) {
  aboutUs.contactInfo.email = email;
  aboutUs.contactInfo.phone = phone;
  additionalInfos
    ? (aboutUs.contactInfo.additionalInfos = additionalInfos)
    : null;

  return Promise.resolve({
    success: true,
    message: "Contact info updated successfully",
  });
}

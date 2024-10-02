import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface ISortingHatProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  userDisplayEmail: String;
  currentTime: Date;
  context: WebPartContext;
}

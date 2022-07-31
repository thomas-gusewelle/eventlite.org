import { Locations, Role } from "@prisma/client";

export type EventFormValues = {
  name: string;
  eventDate: Date;
  eventTime: Date;
  isRepeating: boolean;
  repeatFrequency?: EventRepeatFrequency;
  DEndSelect?: EventEndSelect;
  DNum?: number;
  DDate?: Date;
  WEndSelect?: EventEndSelect;
  WNum?: number;
  WDate?: Date;
  WCEndSelect?: EventEndSelect;
  WCNum?: number;
  WCDate?: Date;
  WCSun?: boolean;
  WCMon?: boolean;
  WCTues?: boolean;
  WCWed?: boolean;
  WCThurs?: boolean;
  WCFri?: boolean;
  WCSat?: boolean;
  MEndSelect?: EventEndSelect;
  MNum?: number;
  MDate?: Date;
  positions: {
    eventPositionId?: string;
    position: { organizationId?: string | undefined; id: string; name: string };
    quantity: number;
  }[];
  eventLocation: Locations;
};

export type EventRepeatFrequency = {
  id: "D" | "W" | "WC" | "M";
  name: string;
};

export type EventEndSelect = { id: "Num" | "Date"; name: string };

export type Position = {
  position: Role;
  quantity: number;
};

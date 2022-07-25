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
};

export type EventRepeatFrequency = {
  id: "D" | "W" | "WC" | "M";
  name: string;
};

export type EventEndSelect = { id: "Num" | "Date"; name: string };

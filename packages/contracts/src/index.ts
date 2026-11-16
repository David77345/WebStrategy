export type Service = {
  id: string;
  title: string;
  description: string;
};

export type CompanyContent = {
  eyebrow: string;
  headline: string;
  headlineAccent: string;
  summary: string;
  mission: string;
  services: readonly Service[];
  method: readonly MethodStep[];
};

export type MethodStep = {
  id: string;
  title: string;
  description: string;
};

export type SocialLink = {
  label: string;
  url: `https://${string}`;
};

export type BookingStatus =
  "pending" | "confirmed" | "rescheduled" | "cancelled";

export type BookingEvent = {
  provider: "cal.com";
  externalId: string;
  status: BookingStatus;
  startsAtUtc: string;
  endsAtUtc: string;
  timeZone: string;
};
export * from "./leads";

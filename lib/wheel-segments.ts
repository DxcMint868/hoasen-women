export const WHEEL_SEGMENTS = [
  { key: "voucher",          label: "A voucher, just for you",                 limited: true  },
  { key: "wfh_day",          label: "One WFH day, no questions asked",          limited: false },
  { key: "company_trip",     label: "A secret gift on the next company trip",   limited: true  },
  { key: "pick_restaurant",  label: "You pick the restaurant, next team lunch", limited: false },
  { key: "leave_early",      label: "Leave an hour early, any day you choose",  limited: false },
  { key: "skip_meeting",     label: "Skip any one meeting, zero explanation",   limited: false },
  { key: "appreciation",     label: "Employee of Every Single Day",             limited: false },
  { key: "quiet_confidence", label: "The confidence you already had all along", limited: false },
] as const;

export type WheelSegment = (typeof WHEEL_SEGMENTS)[number];

export interface VoucherCard {
  id: string;
  assigned_to: string | null;
  card_image_url: string | null;
  card_code: string | null;
  status: "pending" | "ready";
  notes: string | null;
  created_at: string;
}

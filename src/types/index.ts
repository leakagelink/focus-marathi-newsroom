export type Role = "public" | "journalist" | "editor" | "admin";
export type Division = "कोकण" | "पुणे" | "नाशिक" | "छत्रपती संभाजीनगर" | "अमरावती" | "नागपूर";
export type Category = "राजकारण" | "गुन्हे" | "शेती" | "हवामान" | "क्रीडा" | "मनोरंजन";
export type NewsStatus = "pending" | "approved" | "rejected" | "revision" | "broadcasted";
export type Importance = "normal" | "trending" | "breaking";
export type ClipType = "location" | "anchor" | "byte1" | "byte2";

export interface District { id: string; name: string; nameEn: string; division: Division; seats: number }
export interface Constituency { id: string; code: string; name: string; districtId: string; hasRep: boolean }
export interface Journalist {
  id: string; name: string; role: string; districtId: string; constituencyId: string; code: string;
  phone: string; email: string; rating: number; submitted: number; approved: number;
  status: "verified" | "pending" | "inactive"; avatar: string;
}
export interface NewsArticle {
  id: string; headline: string; script: string; category: Category; districtId: string; constituency: string;
  reporterId: string; createdAt: string; status: NewsStatus; importance: Importance; image: string;
  clips: Record<ClipType, boolean>; clipUrls?: Partial<Record<ClipType, string>>; clipPaths?: Partial<Record<ClipType, string>>; urgent: boolean; feedback?: string | undefined; aiVoice: boolean; views: number;
}
export interface BreakingNews { id: string; text: string; region: string; minutes: number; createdAt: string }
export interface Advertisement {
  id: string; advertiser: string; contact: string; type: string; target: string; start: string; end: string;
  impressions: number; clicks: number; budget: number; paid: boolean; active: boolean; url: string;
}
export interface Payment { id: string; journalistId: string; month: string; base: number; stories: number; exclusives: number; status: "paid" | "processing" }

import farmer from "@/assets/farmer.jpg";
import vidhan from "@/assets/vidhan.jpg";
import metro from "@/assets/metro.jpg";
import studio from "@/assets/studio.jpg";
import type { Advertisement, BreakingNews, Journalist, NewsArticle, Payment } from "@/types";

export const IMAGES = { farmer, vidhan, metro, studio };
export const SAMPLE_VIDEO = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
export const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
];

const av = (seed: string) => `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=c8102e,f21d36,3a3b44`;

export const JOURNALISTS: Journalist[] = [
  { id: "j1", name: "राजेश पाटील", role: "विधानसभा प्रतिनिधी", districtId: "satara", constituencyId: "c103", code: "ASM-144", phone: "+91 98220 14411", email: "rajesh.patil@focus24.in", rating: 4.8, submitted: 186, approved: 171, status: "verified", avatar: av("RP") },
  { id: "j2", name: "स्नेहा कुलकर्णी", role: "जिल्हा प्रतिनिधी", districtId: "pune", constituencyId: "c91", code: "ASM-091", phone: "+91 98901 22018", email: "sneha.k@focus24.in", rating: 4.6, submitted: 214, approved: 198, status: "verified", avatar: av("SK") },
  { id: "j3", name: "अमोल देशमुख", role: "विधानसभा प्रतिनिधी", districtId: "nashik", constituencyId: "c142", code: "ASM-142", phone: "+91 97644 30912", email: "amol.d@focus24.in", rating: 4.3, submitted: 132, approved: 115, status: "verified", avatar: av("AD") },
  { id: "j4", name: "प्रिया वानखेडे", role: "विधानसभा प्रतिनिधी", districtId: "nagpur", constituencyId: "c262", code: "ASM-262", phone: "+91 99230 77120", email: "priya.w@focus24.in", rating: 4.5, submitted: 98, approved: 90, status: "verified", avatar: av("PW") },
  { id: "j5", name: "संदीप सावंत", role: "जिल्हा प्रतिनिधी", districtId: "mumbaicity", constituencyId: "c5", code: "ASM-005", phone: "+91 98670 45501", email: "sandeep.s@focus24.in", rating: 4.1, submitted: 77, approved: 64, status: "verified", avatar: av("SS") },
  { id: "j6", name: "गणेश शिंदे", role: "विधानसभा प्रतिनिधी", districtId: "satara", constituencyId: "c97", code: "ASM-097", phone: "+91 90110 22334", email: "ganesh.s@focus24.in", rating: 0, submitted: 0, approved: 0, status: "pending", avatar: av("GS") },
];

const full = { location: true, anchor: true, byte1: true, byte2: true };
const ago = (m: number) => new Date(Date.now() - m * 60000).toISOString();

export const NEWS: NewsArticle[] = [
  { id: "F24-1042", headline: "सातारा : शेतकऱ्यांची पिक विमा संदर्भात तातडीची मागणी", script: "सातारा जिल्ह्यातील कराड तालुक्यातील शेतकऱ्यांनी पिक विमा मिळावा यासाठी तहसील कार्यालयासमोर निवेदन दिले. अतिवृष्टीमुळे झालेल्या नुकसानीमुळे शेतकरी अडचणीत आहेत. प्रशासनाने तातडीने पंचनामे करून नुकसान भरपाई द्यावी, अशी मागणी शेतकरी संघटनांनी केली आहे.", category: "शेती", districtId: "satara", constituency: "कराड दक्षिण", reporterId: "j1", createdAt: ago(12), status: "pending", importance: "trending", image: farmer, clips: full, urgent: true, aiVoice: true, views: 0 },
  { id: "F24-1041", headline: "पुणे : शहरात पुन्हा पावसाची दमदार हजेरी, अनेक भागात पाणी साचले", script: "पुणे शहरात आज दुपारपासून मुसळधार पावसाने हजेरी लावली. शिवाजीनगर, कोथरूड आणि हडपसर परिसरात रस्त्यांवर पाणी साचल्याने वाहतूक कोंडी झाली. हवामान विभागाने पुढील दोन दिवस यलो अलर्ट जारी केला आहे.", category: "हवामान", districtId: "pune", constituency: "शिवाजीनगर", reporterId: "j2", createdAt: ago(25), status: "pending", importance: "breaking", image: metro, clips: full, urgent: true, aiVoice: true, views: 0 },
  { id: "F24-1040", headline: "विधानभवनात हिवाळी अधिवेशनाच्या तयारीला वेग", script: "आगामी हिवाळी अधिवेशनाच्या पार्श्वभूमीवर विधानभवनात तयारीला वेग आला आहे. सुरक्षा व्यवस्था, माध्यम कक्ष आणि आमदार निवास यांची पाहणी विधानसभा अध्यक्षांनी केली.", category: "राजकारण", districtId: "mumbaicity", constituency: "कुलाबा", reporterId: "j5", createdAt: ago(48), status: "pending", importance: "normal", image: vidhan, clips: { location: true, anchor: true, byte1: true, byte2: false }, urgent: false, aiVoice: false, views: 0 },
  { id: "F24-1039", headline: "नाशिक : द्राक्ष बागायतदारांना अवकाळीचा फटका", script: "निफाड तालुक्यात झालेल्या अवकाळी पावसामुळे द्राक्ष बागांचे मोठे नुकसान झाले आहे. कृषी विभागाने पंचनामे सुरू केले असून शेतकऱ्यांनी सरकारकडे मदतीची मागणी केली आहे.", category: "शेती", districtId: "nashik", constituency: "निफाड", reporterId: "j3", createdAt: ago(70), status: "pending", importance: "normal", image: farmer, clips: full, urgent: false, aiVoice: true, views: 0 },
  { id: "F24-1038", headline: "पुणे मेट्रोच्या नव्या मार्गिकेची चाचणी यशस्वी", script: "पुणे मेट्रोच्या स्वारगेट मार्गिकेची चाचणी यशस्वीपणे पार पडली. लवकरच ही मार्गिका प्रवाशांसाठी खुली होणार असल्याची माहिती महामेट्रोने दिली.", category: "राजकारण", districtId: "pune", constituency: "पर्वती", reporterId: "j2", createdAt: ago(130), status: "approved", importance: "trending", image: metro, clips: full, urgent: false, aiVoice: true, views: 48210 },
  { id: "F24-1037", headline: "नागपूर : संत्रा उत्पादकांसाठी नवीन प्रक्रिया केंद्र", script: "विदर्भातील संत्रा उत्पादकांसाठी काटोल येथे नवीन प्रक्रिया केंद्र उभारले जाणार आहे. यामुळे हजारो शेतकऱ्यांना थेट फायदा होणार आहे.", category: "शेती", districtId: "nagpur", constituency: "काटोल", reporterId: "j4", createdAt: ago(200), status: "broadcasted", importance: "normal", image: farmer, clips: full, urgent: false, aiVoice: true, views: 31877 },
  { id: "F24-1036", headline: "मुंबई : लोकल सेवा विस्कळीत, प्रवाशांचे हाल", script: "मध्य रेल्वेवर तांत्रिक बिघाडामुळे लोकल सेवा तासभर विस्कळीत झाली. सकाळी कामावर जाणाऱ्या प्रवाशांचे मोठे हाल झाले.", category: "गुन्हे", districtId: "mumbaicity", constituency: "भायखळा", reporterId: "j5", createdAt: ago(260), status: "approved", importance: "breaking", image: metro, clips: full, urgent: false, aiVoice: false, views: 92344 },
  { id: "F24-1035", headline: "कोल्हापूर : कुस्ती स्पर्धेत सातारच्या मल्लाची बाजी", script: "कोल्हापुरात झालेल्या राज्यस्तरीय कुस्ती स्पर्धेत सातारच्या मल्लाने सुवर्णपदक पटकावले. विजेत्याची गावात मिरवणूक काढण्यात आली.", category: "क्रीडा", districtId: "satara", constituency: "पाटण", reporterId: "j1", createdAt: ago(400), status: "broadcasted", importance: "normal", image: vidhan, clips: full, urgent: false, aiVoice: true, views: 22010 },
  { id: "F24-1034", headline: "कराड : रस्त्याच्या कामावरून ग्रामस्थांचे आंदोलन", script: "कराड तालुक्यातील रस्त्याचे काम रखडल्याने ग्रामस्थांनी रास्ता रोको आंदोलन केले.", category: "राजकारण", districtId: "satara", constituency: "कराड दक्षिण", reporterId: "j1", createdAt: ago(900), status: "rejected", importance: "normal", image: farmer, clips: { location: true, anchor: false, byte1: true, byte2: true }, urgent: false, feedback: "अँकरिंग क्लिप अस्पष्ट आहे. कृपया पुन्हा शूट करा.", aiVoice: false, views: 0 },
  { id: "F24-1033", headline: "मराठवाड्यात नाट्य महोत्सवाला उत्स्फूर्त प्रतिसाद", script: "छत्रपती संभाजीनगर येथे आयोजित नाट्य महोत्सवाला प्रेक्षकांचा उत्स्फूर्त प्रतिसाद मिळाला.", category: "मनोरंजन", districtId: "chhsambhajinagar", constituency: "छत्रपती संभाजीनगर – 1", reporterId: "j3", createdAt: ago(1300), status: "approved", importance: "normal", image: studio, clips: full, urgent: false, aiVoice: true, views: 12040 },
];

export const BREAKING: BreakingNews[] = [
  { id: "b1", text: "महाराष्ट्रात पुढील ४८ तासांत मुसळधार पावसाचा इशारा", region: "संपूर्ण महाराष्ट्र", minutes: 60, createdAt: ago(5) },
  { id: "b2", text: "पुणे–मुंबई द्रुतगती मार्गावर दरड कोसळली, वाहतूक संथ", region: "पुणे", minutes: 30, createdAt: ago(15) },
  { id: "b3", text: "विधानसभा हिवाळी अधिवेशन ९ डिसेंबरपासून नागपुरात", region: "नागपूर", minutes: 120, createdAt: ago(40) },
];

export const ADS: Advertisement[] = [
  { id: "ad1", advertiser: "कृषी मित्र ट्रॅक्टर्स", contact: "+91 98220 11111", type: "Video Pre-roll (15s)", target: "पुणे विभाग", start: "2026-11-01", end: "2026-11-30", impressions: 184320, clicks: 4210, budget: 150000, paid: true, active: true, url: "https://example.com/krushi" },
  { id: "ad2", advertiser: "सह्याद्री सहकारी बँक", contact: "+91 98900 22222", type: "Ticker Sponsor Logo", target: "संपूर्ण महाराष्ट्र", start: "2026-10-15", end: "2026-12-15", impressions: 402110, clicks: 6120, budget: 320000, paid: false, active: true, url: "https://example.com/sahyadri" },
];

export const PAYMENTS: Payment[] = JOURNALISTS.filter((j) => j.status === "verified").map((j, i) => ({
  id: `p${i}`, journalistId: j.id, month: "ऑक्टोबर 2026", base: 5000, stories: [24, 31, 18, 15, 11][i] ?? 0, exclusives: [3, 2, 1, 2, 0][i] ?? 0, status: i % 2 ? "processing" : "paid",
}));

export const CATEGORIES = ["राजकारण", "गुन्हे", "शेती", "हवामान", "क्रीडा", "मनोरंजन"] as const;

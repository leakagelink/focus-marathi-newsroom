import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { JournalistApp } from "@/components/journalist/JournalistApp";
import { Glass } from "@/components/ui/glass";

export const Route = createFileRoute("/journalist")({
  head: () => ({
    meta: [
      { title: "पत्रकार पोर्टल — FOCUS 24 NEWS" },
      { name: "description", content: "FOCUS 24 NEWS पत्रकारांसाठी 4-क्लिप बातमी अपलोड, स्थिती ट्रॅकिंग आणि कमाई." },
      { property: "og:title", content: "पत्रकार पोर्टल — FOCUS 24 NEWS" },
      { property: "og:description", content: "Journalist mobile app for structured news upload." },
    ],
  }),
  component: () => (
    <main className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 md:px-4 md:py-8 lg:flex-row lg:items-start lg:justify-center">
      <PhoneFrame><div className="relative h-full"><JournalistApp /></div></PhoneFrame>
      <Glass className="hidden max-w-sm space-y-2 p-5 text-sm md:block">
        <h2 className="text-lg font-bold">डेमो सूचना</h2>
        <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
          <li>OTP पाठवा → <b className="text-foreground">1234</b> टाका.</li>
          <li>प्रत्येक क्लिपसाठी “डेमो” किंवा स्वतःची व्हिडिओ फाइल निवडा.</li>
          <li>“नमुना भरा” दाबा आणि बातमी अपलोड करा.</li>
          <li>Admin Panel → News Approvals मध्ये ती बातमी दिसेल.</li>
        </ol>
      </Glass>
    </main>
  ),
});

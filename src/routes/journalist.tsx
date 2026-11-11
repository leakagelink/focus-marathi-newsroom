import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/PhoneFrame";
import { JournalistApp } from "@/components/journalist/JournalistApp";
import { Glass } from "@/components/ui/glass";

export const Route = createFileRoute("/journalist")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "पत्रकार पोर्टल — FOCUS 24 NEWS" },
      { name: "description", content: "FOCUS 24 NEWS पत्रकारांसाठी 4-क्लिप बातमी अपलोड, स्थिती ट्रॅकिंग आणि कमाई." },
      { property: "og:title", content: "पत्रकार पोर्टल — FOCUS 24 NEWS" },
      { property: "og:description", content: "Journalist mobile app for structured news upload." },
    ],
  }),
  component: () => (
    <main className="mx-auto flex max-w-[1200px] flex-col items-center gap-8 md:px-4 md:py-8 lg:flex-row lg:items-start lg:justify-center">
      <PhoneFrame><div className="relative h-full"><JournalistApp /></div></PhoneFrame>
    </main>
  ),
});

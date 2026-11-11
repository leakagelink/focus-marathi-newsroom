import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Radio, Smartphone, UserRound } from "lucide-react";
import { PhoneFrame } from "@/components/PhoneFrame";
import { PublicApp } from "@/components/public/PublicApp";
import { Glass, Logo } from "@/components/ui/glass";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "FOCUS 24 NEWS मराठी — महाराष्ट्राचे डिजिटल न्यूज नेटवर्क" },
      { name: "description", content: "महाराष्ट्राच्या 288 विधानसभा क्षेत्रांतील ताज्या मराठी बातम्या, 24×7 लाईव्ह टीव्ही आणि सुपरफास्ट 100." },
      { property: "og:title", content: "FOCUS 24 NEWS मराठी" },
      { property: "og:description", content: "Maharashtra's Digital News Network — hyperlocal Marathi news." },
    ],
  }),
  component: Index,
});

const flow = [
  { icon: UserRound, t: "1. पत्रकार अपलोड", d: "4 व्हिडिओ क्लिप + स्क्रिप्ट", to: "/journalist" },
  { icon: CheckCircle2, t: "2. संपादकीय मंजुरी", d: "Review Studio मध्ये मंजूर करा", to: "/admin" },
  { icon: Radio, t: "3. लाईव्ह प्रसारण", d: "Broadcast Studio मधून ON AIR", to: "/broadcast" },
  { icon: Smartphone, t: "4. Public App", d: "प्रेक्षकांना त्वरित दिसते", to: "/" },
] as const;

function Index() {
  return (
    <main className="mx-auto flex max-w-[1400px] flex-col items-center gap-10 md:px-4 md:py-8 lg:flex-row lg:items-start lg:justify-center">
      <PhoneFrame><PublicApp /></PhoneFrame>
      <div className="hidden max-w-md space-y-5 md:block lg:pt-10">
        <Logo size="lg" />
        <p className="text-xs font-semibold tracking-[0.3em] text-muted-foreground">MAHARASHTRA'S DIGITAL NEWS NETWORK</p>
        <h1 className="text-2xl font-bold leading-snug">36 जिल्हे · 288 विधानसभा · एक डिजिटल न्यूज नेटवर्क</h1>
        <p className="text-sm text-muted-foreground">संपूर्ण कार्यप्रवाह तपासा — पत्रकाराने अपलोड केलेली बातमी मंजूर करा, प्रसारित करा आणि ती या ॲपमध्ये लगेच दिसेल.</p>
        <div className="space-y-2">
          {flow.map((f) => (
            <Link key={f.t} to={f.to}>
              <Glass className="mb-2 flex items-center gap-3 p-3 transition hover:border-primary/50 hover:glow">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/15 text-neon"><f.icon className="size-5" /></div>
                <div className="flex-1"><div className="font-semibold">{f.t}</div><div className="text-xs text-muted-foreground">{f.d}</div></div>
                <ArrowRight className="size-4 text-faint" />
              </Glass>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

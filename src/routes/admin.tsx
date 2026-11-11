import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, Users, MapPin } from "lucide-react";
import { BackButton } from "@/components/BackButton";
import { Stat } from "@/components/ui/glass";
import { useStore } from "@/lib/store";
import { AccountForm } from '@/components/AccountForm';
import { AdminManagement, RecordManager } from '@/components/admin/Management';
import { NewsManager } from '@/components/admin/NewsManager';
import { supabase } from '@/integrations/supabase/client';
import { refreshCloud } from '@/lib/store';

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Admin Dashboard — FOCUS 24 NEWS" },
      { name: "description", content: "FOCUS 24 NEWS संपादकीय मंजुरी, ब्रेकिंग न्यूज आणि नेटवर्क नियंत्रण." },
      { property: "og:title", content: "Admin Dashboard — FOCUS 24 NEWS" },
      { property: "og:description", content: "Editorial approvals and network control." },
    ],
  }),
  component: Admin,
});

function Admin() {
  const userId = useStore(s => s.userId);
  const role = useStore(s => s.role);
  const ready = useStore(s => s.ready);
  const news = useStore((s) => s.news);
  const breaking = useStore((s) => s.breaking);
  const pending = news.filter((n) => n.status === "pending");
  if (!ready) return <main className="p-6">कृपया थांबा…</main>;
  if (!userId) return <main><BackButton /><AccountForm /></main>;
  if (role !== 'admin' && role !== 'editor') return <main className="space-y-4 p-6"><BackButton /><h1 className="font-bold">संपादकीय प्रवेश आवश्यक</h1><p>या खात्याला संपादकीय परवानगी नाही.</p></main>;
  return (
    <main className="mx-auto max-w-[1400px] space-y-4 px-3 py-4 sm:space-y-5 sm:px-4 sm:py-6">
      <div className="flex flex-wrap items-center gap-2">
        <BackButton />
        <h1 className="text-lg font-bold sm:text-2xl">FOCUS 24 NEWS मराठी · संपूर्ण नियंत्रण पॅनेल</h1>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat icon={<Users className="size-5" />} value={news.length} label="एकूण बातम्या" />
        <Stat icon={<MapPin className="size-5" />} value={new Set(news.map(n=>n.districtId)).size} label="बातम्यांचे जिल्हे" />
        <Stat red icon={<Clock className="size-5" />} value={pending.length} label="प्रलंबित बातम्या" />
        <Stat icon={<CheckCircle2 className="size-5" />} value={news.filter((n) => n.status === "approved").length} label="आज मंजूर" />
      </div>
      <NewsManager />
      <AdminManagement admin={role==='admin'} />
      <RecordManager title="ब्रेकिंग बातम्या" rows={breaking.map(b=>({...b}))} fields={[{key:'text',label:'बातमी',type:'textarea'},{key:'region',label:'भाग'},{key:'minutes',label:'मिनिटे',type:'number'}]} save={async(d,id)=>{const values={text:d['text'] ?? '',region:d['region'] ?? '',minutes:Number(d['minutes'])||30};const result=id?await supabase.from('breaking_news').update(values).eq('id',id).select('id').single():await supabase.from('breaking_news').insert(values).select('id').single();if(result.error)throw new Error(result.error.message);await refreshCloud();}} remove={async id=>{const {error}=await supabase.from('breaking_news').delete().eq('id',id).select('id').single();if(error)throw new Error(error.message);await refreshCloud();}} />
    </main>
  );
}

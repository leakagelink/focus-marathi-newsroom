import { createFileRoute } from '@tanstack/react-router';
import { PhoneFrame } from '@/components/PhoneFrame';
import { PublicApp } from '@/components/public/PublicApp';
import { getSharedNews } from '@/lib/share-news.functions';

const FALLBACK_IMAGE = 'https://news.homemuse.in/__l5e/assets-v1/cb1ed646-072a-4504-88d9-c79dcea8c1e2/focus-24-v4-icon-512.png';

export const Route = createFileRoute('/news/$id')({
  loader: async ({ params }) => {
    try { return await getSharedNews({ data: { id: params.id } }); } catch { return null; }
  },
  head: ({ loaderData }) => {
    const title = loaderData?.headline ? `${loaderData.headline} — FOCUS 24 NEWS मराठी` : 'FOCUS 24 NEWS मराठी — बातमी';
    const description = loaderData?.description || 'महाराष्ट्रातील प्रत्येक बातमीवर फोकस — FOCUS 24 NEWS मराठी.';
    const image = loaderData?.image || FALLBACK_IMAGE;
    return { meta: [
      { title }, { name: 'description', content: description },
      { property: 'og:type', content: 'article' }, { property: 'og:title', content: loaderData?.headline ?? title },
      { property: 'og:description', content: description }, { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' }, { name: 'twitter:image', content: image },
    ] };
  },
  component: SharedStory,
});

function SharedStory() {
  const { id } = Route.useParams();
  return <main className="mx-auto flex max-w-[1400px] justify-center md:px-4 md:py-8"><PhoneFrame><PublicApp initialStoryId={id} /></PhoneFrame></main>;
}

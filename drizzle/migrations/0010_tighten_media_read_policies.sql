DROP POLICY IF EXISTS ad_images_read ON storage.objects;
CREATE POLICY ad_images_editor_read ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'ad-images' AND public.is_editor());
CREATE POLICY ad_images_active_ad_read ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'ad-images' AND EXISTS (SELECT 1 FROM public.app_content a WHERE a.kind = 'advertisement' AND a.active AND a.data->>'image' = storage.objects.name));
DROP POLICY IF EXISTS news_thumbs_read ON storage.objects;
CREATE POLICY news_thumbs_owner_read ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'news-thumbs' AND owner_id = (select auth.uid()::text));
CREATE POLICY news_thumbs_editor_read ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'news-thumbs' AND public.is_editor());
CREATE POLICY news_thumbs_published_read ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'news-thumbs' AND EXISTS (SELECT 1 FROM public.news n WHERE n.status IN ('approved','broadcasted') AND n.image = storage.objects.name));
DROP POLICY IF EXISTS read_breaking ON public.breaking_news;
CREATE POLICY read_breaking ON public.breaking_news FOR SELECT TO anon, authenticated USING (length(trim(text)) > 0);
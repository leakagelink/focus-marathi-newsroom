DROP POLICY read_broadcast ON public.broadcast_settings;
CREATE POLICY read_broadcast ON public.broadcast_settings FOR SELECT TO authenticated USING(public.is_editor());
REVOKE SELECT ON public.broadcast_settings FROM anon;
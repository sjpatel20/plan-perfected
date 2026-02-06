-- Create storage bucket for crop scan images
INSERT INTO storage.buckets (id, name, public) VALUES ('crop-scans', 'crop-scans', true);

-- Storage policies for crop scans bucket
CREATE POLICY "Users can upload their own crop scans"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'crop-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own crop scans"
ON storage.objects FOR SELECT
USING (bucket_id = 'crop-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own crop scans"
ON storage.objects FOR DELETE
USING (bucket_id = 'crop-scans' AND auth.uid()::text = (storage.foldername(name))[1]);
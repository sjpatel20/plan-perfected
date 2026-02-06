-- Make crop-scans bucket private to protect farmer crop disease photos
UPDATE storage.buckets 
SET public = false 
WHERE id = 'crop-scans';
# Image Upload Setup Instructions

## 1. Update Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Add profile picture and cover photo columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS profile_picture TEXT,
ADD COLUMN IF NOT EXISTS cover_photo TEXT;

-- Add comments for documentation
COMMENT ON COLUMN profiles.profile_picture IS 'Public URL to user profile picture stored in Supabase Storage';
COMMENT ON COLUMN profiles.cover_photo IS 'Public URL to user cover photo stored in Supabase Storage';
```

## 2. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Enter bucket name: `profile-images`
5. Make the bucket **Public** (check the public option)
6. Click **Create bucket**

## 3. Set Storage Policies

After creating the bucket, set these policies:

```sql
-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload their own profile images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own profile images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access to all profile images
CREATE POLICY "Public can view profile images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'profile-images');
```

## 4. Verify Setup

After completing the above steps, test the image upload by:
1. Clicking the camera icon on the cover photo
2. Selecting an image file
3. Verifying the image appears in the profile
4. Checking that the URL is saved in the database

## Notes

- Images are stored with the path: `{userId}/cover-{timestamp}.{extension}` or `{userId}/profile-{timestamp}.{extension}`
- Only authenticated users can upload/modify/delete their own images
- All profile images are publicly readable
- Supported formats: jpg, jpeg, png, gif, webp
- Maximum file size: 5MB (configurable in Supabase)

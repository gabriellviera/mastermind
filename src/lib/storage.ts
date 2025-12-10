import { supabase } from './supabase';

export const uploadFile = async (file: File, bucket: string = 'course-content') => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const getPublicUrl = (path: string, bucket: string = 'course-content') => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

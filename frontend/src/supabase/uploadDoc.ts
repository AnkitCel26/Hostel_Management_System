import { supabase } from './supabaseClient';
 
export async function uploadDocument(file: File): Promise<string> {
  const randomNum = Math.floor(100 + Math.random() * 900);
  const fileName = `${file.name}_${randomNum}`;
 
  const { error } = await supabase.storage
    .from('documents')
    .upload(fileName, file, { cacheControl: '3600', upsert: false });
 
  if (error) {
    throw error;
  }
 
  const {
    data: { publicUrl },
  } = supabase.storage.from('documents').getPublicUrl(fileName);
 
  return publicUrl;
}
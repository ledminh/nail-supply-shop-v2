import { createClient } from "@supabase/supabase-js";
import { FileOptions } from "@supabase/storage-js";

const supabase = createClient(
  process.env.SUPABASE_STORAGE_URL as string,
  process.env.SUPABASE_API_KEY as string
);

// Upload file using standard upload
export default async function uploadFile(
  bucketName: string,
  filePath: string,
  file: Buffer,
  fileOptions: FileOptions
) {
  return supabase.storage.from(bucketName).upload(filePath, file, fileOptions);
}

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_STORAGE_URL as string,
  process.env.SUPABASE_API_KEY as string
);

export default async function removeFile(
  bucketName: string,
  filePaths: string[]
) {
  return supabase.storage.from(bucketName).remove(filePaths);
}

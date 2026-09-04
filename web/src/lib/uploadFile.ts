import { put } from '@vercel/blob';

export const uploadFile = async (file: File) => {
    const blob = await put(file.name, file, {
    access: 'public',
    token: process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN
  
  });

  return blob.url;
};



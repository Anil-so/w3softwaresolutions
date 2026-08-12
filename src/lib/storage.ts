import { supabase } from './supabase';

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx'];
export const ALLOWED_RESUME_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export function validateResumeFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return { valid: false, error: `File size (${sizeMb} MB) exceeds the maximum limit of 5 MB.` };
  }

  const fileNameLower = file.name.toLowerCase();
  const hasValidExtension = ALLOWED_RESUME_EXTENSIONS.some((ext) => fileNameLower.endsWith(ext));
  const hasValidMime = ALLOWED_RESUME_MIME_TYPES.includes(file.type);

  if (!hasValidExtension && !hasValidMime) {
    return {
      valid: false,
      error: 'Invalid file format. Only PDF, DOC, and DOCX files are supported.',
    };
  }

  return { valid: true };
}

export async function uploadResumeFile(
  file: File,
  userId: string,
  previousPath?: string
): Promise<{ path: string | null; error: string | null }> {
  const validation = validateResumeFile(file);
  if (!validation.valid) {
    return { path: null, error: validation.error || 'Invalid file.' };
  }

  if (!userId) {
    return { path: null, error: 'User must be authenticated to upload a resume.' };
  }

  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const timestamp = Date.now();
    const filePath = `${userId}/${timestamp}_${cleanFileName}`;

    const { data, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return { path: null, error: uploadError.message || 'Failed to upload resume file to storage.' };
    }

    // Delete previous resume file if replacement succeeded
    if (previousPath && previousPath !== data.path) {
      try {
        await supabase.storage.from('resumes').remove([previousPath]);
      } catch (removeErr) {
        console.warn('Failed to clean up old resume file:', removeErr);
      }
    }

    return { path: data.path, error: null };
  } catch (err: any) {
    console.error('Unexpected upload error:', err);
    return { path: null, error: err.message || 'Unexpected error during resume upload.' };
  }
}

export async function getResumeSignedUrl(
  path: string,
  expiresInSeconds = 3600
): Promise<{ url: string | null; error: string | null }> {
  if (!path) {
    return { url: null, error: 'No resume path provided.' };
  }

  try {
    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(path, expiresInSeconds);

    if (error) {
      console.error('Signed URL generation error:', error);
      return { url: null, error: error.message || 'Failed to generate download link.' };
    }

    return { url: data.signedUrl, error: null };
  } catch (err: any) {
    console.error('Unexpected signed URL error:', err);
    return { url: null, error: err.message || 'Error generating resume link.' };
  }
}

export async function deleteResumeFile(path: string): Promise<{ success: boolean; error: string | null }> {
  if (!path) return { success: true, error: null };

  try {
    const { error } = await supabase.storage.from('resumes').remove([path]);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error deleting resume file.' };
  }
}

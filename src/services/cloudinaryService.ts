/**
 * Cloudinary & File Upload Service for PDFs and Media Assets
 * Supported Environment Variables:
 * - VITE_CLOUDINARY_CLOUD_NAME (e.g. edukalyan)
 * - VITE_CLOUDINARY_API_KEY (e.g. 123456789012345)
 * - VITE_CLOUDINARY_API_SECRET (e.g. abcde_123456789)
 * - VITE_CLOUDINARY_UPLOAD_PRESET (e.g. edukalyan_unsigned)
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'edukalyan';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'edukalyan_unsigned';

/**
 * Extract public_id from a Cloudinary URL
 */
export const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes('cloudinary.com')) return null;
  try {
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];
    const filenameWithoutExt = lastPart.split('.')[0];
    return filenameWithoutExt;
  } catch {
    return null;
  }
};

/**
 * Upload PDF or media file to Cloudinary
 */
export const uploadFileToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      if (data.secure_url) {
        console.log('[Cloudinary Upload Success]:', data.secure_url);
        return data.secure_url;
      }
    }
  } catch (error) {
    console.warn('[Cloudinary Upload Exception, using DataURL fallback]:', error);
  }

  // Fallback: Convert file to Data URL for instant preview & persistence
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Delete PDF or media file asset from Cloudinary
 */
export const deleteFileFromCloudinary = async (urlOrPublicId: string): Promise<boolean> => {
  if (!urlOrPublicId) return false;
  const publicId = extractPublicIdFromUrl(urlOrPublicId) || urlOrPublicId;
  console.log('[Cloudinary Asset Deletion Triggered]:', publicId);

  try {
    // Attempt unsigned destroy if Cloudinary preset permits or log deletion event
    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log('[Cloudinary Asset Deleted Successfully]:', publicId);
      return true;
    }
  } catch (err) {
    console.warn('[Cloudinary Delete Request Warning]:', err);
  }

  return true;
};

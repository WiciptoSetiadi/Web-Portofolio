import { supabase } from '../config/supabase.js';

class StorageService {
  /**
   * Upload a file to a specific bucket
   * @param {File} file 
   * @param {string} bucketName 
   * @param {object} options 
   * @returns {Promise<string>} The relative path of the uploaded file
   */
  async uploadFile(file, bucketName, options = {}) {
    this.validateFile(file, bucketName);

    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`; // Just use the root of the bucket for simplicity

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      });

    if (error) {
      console.error('Storage upload error:', error);
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    // Return the path (which is the file name in this case)
    return data.path;
  }

  /**
   * Generate a public URL from a bucket and path
   * @param {string} bucketName 
   * @param {string} path 
   * @returns {string|null}
   */
  getPublicUrl(bucketName, path) {
    if (!path) return null;
    
    // If it's already an absolute URL (legacy or external), return it
    if (path.startsWith('http')) return path;

    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(path);
      
    return data.publicUrl;
  }

  /**
   * Validate file based on bucket rules
   */
  validateFile(file, bucketName) {
    const sizeInMB = file.size / (1024 * 1024);
    
    if (bucketName === 'resume') {
      if (file.type !== 'application/pdf') {
        throw new Error('Resume must be a PDF file.');
      }
      if (sizeInMB > 10) {
        throw new Error('Resume file size must be less than 10MB.');
      }
    } else if (['projects', 'experience', 'certificates', 'gallery'].includes(bucketName)) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload an image (JPG, PNG, WEBP) or a PDF.');
      }
      if (sizeInMB > 10) {
        throw new Error('File size must be less than 10MB.');
      }
    } else {
      // Default to images for other buckets (avatars, logos, etc)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload an image (JPG, PNG, WEBP, SVG).');
      }
      if (sizeInMB > 5) {
        throw new Error('Image file size must be less than 5MB.');
      }
    }
  }

  /**
   * Delete a file from a bucket
   * Handles both relative paths and absolute URLs for backward compatibility
   */
  async deleteFile(bucketName, pathOrUrl) {
    if (!pathOrUrl) return true;
    
    try {
      let filePath = pathOrUrl;
      
      // If it's an absolute URL, extract the path
      if (pathOrUrl.startsWith('http')) {
        const urlParts = pathOrUrl.split(`/${bucketName}/`);
        if (urlParts.length !== 2) return false;
        filePath = urlParts[1];
      }

      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();

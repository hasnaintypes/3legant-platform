import { storage, ID } from "@/lib/appwriteClient";

/**
 * Uploads a file to the specified Appwrite bucket and returns the file URL.
 * @param file - The file to upload (e.g., from an input element).
 * @param bucketId - The Appwrite bucket ID.
 * @returns A response object containing success status, fileId, URL, or error message.
 */
export async function uploadFile(file, bucketId) {
  try {
    if (!file) {
      throw new Error("No file selected");
    }

    if (!bucketId) {
      throw new Error("No bucket Id");
    }

    // Upload file to Appwrite Storage
    const response = await storage.createFile(bucketId, ID.unique(), file);

    // Get the file's preview URL
    const url = storage.getFileView(bucketId, response.$id);

    return { success: true, fileId: response.$id, url };
  } catch (error) {
    console.error("File Upload Error:", error.message);
    return { success: false, error: error.message };
  }
}

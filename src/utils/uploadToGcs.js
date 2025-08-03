import { http } from './http';
import { getUser } from './userActions';

export async function uploadToGCS(files) {
  const user = getUser();
  const { shop } = user || {};
  const fileList = Array.from(files);

  // Step 1: Prepare request payload
  const filesArray = fileList.map((file) => ({
    filename: encodeURIComponent(file.name),
    contentType: file.type,
  }));

  // Step 2: Get signed URLs
  const signedUrlResponse = await http.post(`api/public/file/get-signed-url`, { files: filesArray, shop });

  if (!signedUrlResponse.message === 'Files uploaded successfully!') {
    throw new Error('Failed to get signed URLs');
  }

  const { signedUrls } = signedUrlResponse;

  // Step 3: Upload each file with the corresponding signed URL
  const uploadPromises = signedUrls.map(async ({ actualFileName, url, publicUrl }) => {
    const file = fileList.find((f) => encodeURIComponent(f.name) === actualFileName);
    if (!file) {
      console.warn(`File not found for: ${actualFileName}`);
      return Promise.resolve(undefined); // avoid undefined index
    }

    return fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file,
    });
  });

  /**
   * Place the api to upload images into the gcloud
   */
  const data = await Promise.all(uploadPromises);

  const removeQueryParams = (url) => {
    let urlObj = new URL(url);
    return urlObj.origin + urlObj.pathname; // Removes all query params
  };

  const publicUrls = (data || []).map(({ url }) => removeQueryParams(url));

  return publicUrls;
}

import axios from 'axios';
import FormData from 'form-data';

interface Attachment {
  id: string;
  url: string;
  preview_url: string;
  remote_url: string | null;
  preview_remote_url: string | null;
  text_url: string | null;
  meta: {
    original: { width: number; height: number; size: string; aspect: number };
    small: {
      width: number;
      height: number;
      size: string;
      aspect: number;
    };
  };
  description: string;
  blurhash: string;
}

export class Mastodon {
  private instanceUrl: string;
  private accessToken: string;

  constructor(instanceUrl: string, accessToken: string) {
    this.instanceUrl = instanceUrl;
    this.accessToken = accessToken;
  }

  public postStatus = async (text: string, imageIds: string[]) => {
    const formData = new FormData();
    formData.append('status', text);
    imageIds.forEach((id) => {
      formData.append('media_ids[]', id);
    });
    formData.append('visibility', 'public');
    formData.append('language', 'en');

    return this.post('/api/v1/statuses', formData, formData.getHeaders());
  };

  public uploadImage = async (imageBuffer: Buffer, altText: string) => {
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: 'image.png',
      contentType: 'image/png',
    });
    formData.append('description', altText);

    return this.post<Attachment>(
      '/api/v2/media',
      formData,
      formData.getHeaders()
    );
  };

  private post = async <T>(
    path: string,
    data: Record<string, any>,
    headers: any
  ): Promise<T> => {
    const url = `${this.instanceUrl}${path}`;
    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        'Accept-Encoding': 'utf-8',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    return response.data;
  };
}

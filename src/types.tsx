export interface Hit {
  id: number,
  previewURL: string,
  previewWidth: number,
  previewHeight: number,
  webformatURL: string,
  webformatWidth: number,
  webformatHeight: number,
  pageURL: string,
  tags: string,
  views: number,
  downloads: number,
  favorites: number,
  likes: number,
  comments: number
}

export interface Save {
  id: number,
  pageURL: string,
  previewURL: string
}

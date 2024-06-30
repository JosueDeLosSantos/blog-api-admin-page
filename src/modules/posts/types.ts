type photoType = {
  filename: string;
  originalname: string;
  mimetype: string;
  path: string;
  size: number;
};

export type galleryImageType =
  | {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      destination: string;
      filename: string;
      path: string;
      size: number;
      _id: string;
    }
  | undefined;

export type postTypes = {
  _id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  file: photoType;
  __v: number;
};

export type onePostType = {
  _id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  post: string;
  file: photoType;
  gallery: galleryImageType[];
  comments: {
    _id: string;
    comment: string;
    author: string;
    date: string;
    email: string;
    name: string;
    post: string;
    photo: photoType | null;
    __v: number;
  }[];
  __v: number;
};

export type editPostType = {
  _id: string;
  title: string;
  description: string;
  date: string;
  post: string;
  file: photoType & File;
  gallery: galleryImageType[];
  comments: string[];
  __v: number;
};

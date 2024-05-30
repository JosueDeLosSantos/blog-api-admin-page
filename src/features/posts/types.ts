export type postTypes = {
  _id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  file: {
    filename: string;
    originalname: string;
    mimetype: string;
    path: string;
    size: number;
  };
  __v: number;
};

export type onePostType = {
  _id: string;
  title: string;
  description: string;
  date: string;
  author: string;
  post: string;
  file: {
    filename: string;
    originalname: string;
    mimetype: string;
    path: string;
    size: number;
  };
  comments: {
    _id: string;
    comment: string;
    author: string;
    date: string;
    email: string;
    name: string;
    post: string;
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
  file: {
    filename: string;
    originalname: string;
    mimetype: string;
    path: string;
    size: number;
  };
  comments: string[];
  __v: number;
};

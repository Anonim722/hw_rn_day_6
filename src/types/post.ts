export interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface PostCardProps {
  post: Post;
  onDelete: (id: number) => void;
}

export interface Track {
  title: string;
  author: string;
  src: string;
  thumbnail: string;
}

export interface Book {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink: string;
  totalRating: number;
  averageRating: number;
  keyIdeas: number;
  type: string;
  status: string;
  subscriptionRequired: boolean;
  summary: string;
  tags: string[];
  bookDescription: string;
  authorDescription: string;
}

export const tracks: Track[] = [
  {
    title: "Sample Book Title",
    author: "Sample Author",
    src: "/audio/sample.mp3",
    thumbnail: "/images/sample-cover.jpg",
  },
  // Add more tracks here as needed
];

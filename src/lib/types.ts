export interface QuestionAnswer {
  question: string;
  answer: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phoneLast4: string;
  department: string;
  avatar: string;
  bio?: string;
  wishlist?: string;
  questions: QuestionAnswer[];
  hasViewed?: boolean;
  viewedAt?: string;
  createdAt?: string;
}

export interface IMatch {
  id: string;
  santaId: string;
  santaName: string;
  santaEmail: string;
  santaDepartment: string;
  recipientId: string;
  recipientName: string;
  recipientEmail: string;
  recipientDepartment: string;
  hints: string[];
  matchedAt: string;
}

export interface ISettings {
  rules: string;
  eventDate: string;
  revealDate: string;
  companyDomain?: string;
  companyName?: string;
  companyLogo?: string;
  penalties: string[];
}

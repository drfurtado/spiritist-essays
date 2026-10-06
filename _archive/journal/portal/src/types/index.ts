export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "author" | "editor" | "reviewer";
  createdAt: string;
}

export interface Submission {
  id: string;
  authorId: string;
  title: string;
  abstract: string;
  fileUrl: string;
  fileName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewerEmail: string;
  status: string;
  assignedAt: string;
  submission?: Submission | null;
}

interface Feedback {
  id: string;
  interviewId: string;
  totalScore: number;
  categoryScores: Array<{
    name: string;
    score: number;
    comment: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  finalAssessment: string;
  createdAt: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  questions: string[];
  techstack: string[];
  createdAt: string;
  userId: string;
  type: string;
  coverImage?: string;
  level?: string;
  questions?: string[];
  finalized: boolean;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: { role: string; content: string }[];
  feedbackId?: string;
}

// Add photoURL to your existing User interface
interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  emailVerified?: boolean;
  packs?:string
}

interface InterviewCardProps {
  interviewId: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
  coverImage?: string;
  level?: string;
  questions?: string[];
}

// Add userAvatar to the AgentProps interface
interface AgentProps {
  userName: string;
  userId?: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
  userAvatar?: string;
  remaining?:string;
  interviewrole?:string;
}

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface GetFeedbackByInterviewIdParams {
  interviewId: string;
  userId: string;
}

interface GetLatestInterviewsParams {
  userId: string;
  limit?: number;
}

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

type FormType = "sign-in" | "sign-up";

interface InterviewFormProps {
  interviewId: string;
  role: string;
  level: string;
  type: string;
  techstack: string[];
  amount: number;
}

interface TechIconProps {
  techStack: string[];
}

interface Transaction{
  id:string;
  amount:string;
createdAt:string;
description:string;
oldBalance:number;
orderid:string;
packs:string;
paymentType:string;
paymentid:string;
remaining:number;
type:string;
userId:string;
packType:string
}

interface TransactionProps{
  paymentid: string;//
  orderid:string;
  type:string;
  amount: string;//900 
  packs: string;//5
  paymentType:string;
  oldBalance:string;
  remaining:string;
  userId:string; //userid
  packType:string
}
interface OrderProps{
  paymentid: string;//
  orderid:string;
  amount: string;//900 
  packs: string;//5
  paymentType:string;
  oldBalance:string;
  remaining:string;
  userId:string; //userid
  packType:string 
  
}

interface Packs{
  id:string;
  name:string;
  packs:string;
  amount:string;
  offer:string;
  desc:string;
  flag:boolean

}

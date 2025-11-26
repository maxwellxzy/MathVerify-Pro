export interface MathProblem {
  id: string; // Paper ID
  question_number: number; // 1-10
  img_url?: string;
  markdown: string; // Contains LaTeX
  knowledge_points: string[];
  methods: string[];
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  MODIFIED = 'MODIFIED',
}

export interface ProblemState extends MathProblem {
  status: VerificationStatus;
  original_knowledge_points: string[];
  original_methods: string[];
}

export interface SubmitPayloadItem {
  id: string;
  question_number: number;
  modified: boolean;
  final_knowledge_points: string[];
  final_methods: string[];
}

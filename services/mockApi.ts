import { MathProblem } from '../types';

const API_KEY = '12345abc';

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_DATA: MathProblem[] = [
  {
    id: 'PAPER_2023_001',
    question_number: 1,
    img_url: 'https://picsum.photos/400/200?random=1',
    markdown: '已知函数 $$ f(x) = \\ln(x^2 + 1) $$，求导数 $$ f\'(x) $$。',
    knowledge_points: ['导数', '链式法则'],
    methods: ['直接计算法'],
  },
  {
    id: 'PAPER_2023_001',
    question_number: 2,
    img_url: '',
    markdown: '解方程 $$ x^2 - 5x + 6 = 0 $$，求 $$ x $$ 的值。',
    knowledge_points: ['一元二次方程'],
    methods: ['因式分解法', '公式法'],
  },
  {
    id: 'PAPER_2023_001',
    question_number: 3,
    markdown: '在 $$ \\triangle ABC $$ 中，若 $$ A = 30^\\circ $$，$$ b = 4 $$，$$ c = 5 $$，求三角形面积 $$ S = \\frac{1}{2}bc\\sin A $$。',
    knowledge_points: ['三角函数', '三角形面积'],
    methods: ['公式代入法'],
  },
];

export const fetchProblems = async (key: string): Promise<MathProblem[]> => {
  console.log(`[API] Fetching problems with key: ${key}`);
  await delay(800); // Simulate network latency

  if (key !== API_KEY) {
    throw new Error('Invalid API Key');
  }

  // Generate 10 mock items if needed, here we just repeat mock data to fill 10
  const filledData = Array(10).fill(null).map((_, i) => {
    const template = MOCK_DATA[i % MOCK_DATA.length];
    return {
      ...template,
      question_number: i + 1,
      id: `PAPER_2023_${Math.floor(i / 10) + 1}`,
      // Add some variety to markdown to ensure uniqueness
      markdown: template.markdown + (i > 2 ? ` (变式 ${i})` : '')
    };
  });

  return filledData;
};

export const submitBatch = async (key: string, payload: any[]) => {
  console.log(`[API] Submitting batch with key: ${key}`);
  console.log('[API] Payload:', JSON.stringify(payload, null, 2));
  await delay(1500); // Simulate processing time

  if (key !== API_KEY) {
    throw new Error('Invalid API Key');
  }

  return { success: true, message: 'Batch processed successfully' };
};
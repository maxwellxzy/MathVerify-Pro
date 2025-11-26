import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface MathRenderProps {
  content: string;
}

const MathRender: React.FC<MathRenderProps> = ({ content }) => {
  return (
    <div className="prose prose-slate max-w-none prose-p:my-2 prose-headings:my-3">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Override default element styling if needed
          p: ({ children }) => <p className="leading-relaxed text-slate-800 text-lg">{children}</p>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default React.memo(MathRender);

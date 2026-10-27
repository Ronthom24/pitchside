import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Prose({ children }: { children: string }) {
  return (
    <div className="prose-pitch">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}

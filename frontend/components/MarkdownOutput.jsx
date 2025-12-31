"use client"

import { marked } from 'marked'
import './MarkdownOutput.css'

export default function MarkdownOutput({ rawMarkdown }) {
  const html = marked.parse(rawMarkdown || '')

  return (
    <div className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
  )
}

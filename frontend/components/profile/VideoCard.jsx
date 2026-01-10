"use client"

import { Pencil, X, Play } from 'lucide-react'

export default function VideoCard({ data, onEdit, onDelete }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary-bright)] transition-colors">
      <div className="aspect-video bg-linear-to-br from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] flex items-center justify-center relative">
        <Play className="w-12 h-12 text-white" />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 bg-[var(--color-popover)]/90 hover:bg-[var(--color-popover)] rounded-lg">
            <Pencil className="w-3.5 h-3.5 text-[var(--color-primary-bright)]" />
          </button>
          <button onClick={onDelete} className="p-1.5 bg-[var(--color-popover)]/90 hover:bg-[var(--color-popover)] rounded-lg">
            <X className="w-3.5 h-3.5 text-[var(--color-danger)]" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-[var(--color-foreground)] text-sm mb-1">{data.title}</h4>
        {data.description && (
          <p className="text-xs text-[var(--color-muted-foreground,#8697C4)] line-clamp-2">{data.description}</p>
        )}
      </div>
    </div>
  )
}

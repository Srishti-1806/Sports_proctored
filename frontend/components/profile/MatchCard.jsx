"use client"

import { Pencil, X } from 'lucide-react'

export default function MatchCard({ data, onEdit, onDelete, showControls = true }) {
  const resultColors = {
    win: 'from-green-500 to-emerald-400',
    loss: 'from-red-500 to-pink-500',
    draw: 'from-gray-400 to-gray-500'
  }
  
  return (
    <div className="p-4 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-primary-bright)] transition-colors group bg-[var(--color-card)]">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`px-3 py-1 rounded-lg bg-linear-to-r ${resultColors[data.result]} text-white text-xs font-bold uppercase`}>
              {data.result}
            </div>
            <span className="text-sm font-bold text-[var(--color-foreground)]">{data.score}</span>
          </div>
          <h4 className="font-semibold text-[var(--color-foreground)]">vs {data.opponent}</h4>
          <p className="text-xs text-[var(--color-muted-foreground,#8697C4)] mt-1">{new Date(data.date).toLocaleDateString()}</p>
          {data.performance && (
            <p className="text-sm text-[var(--color-foreground)] mt-2">{data.performance}</p>
          )}
        </div>
        {showControls && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 hover:bg-[var(--color-primary-soft)] rounded-lg">
              <Pencil className="w-3.5 h-3.5 text-[var(--color-muted-foreground,#8697C4)]" />
            </button>
            <button onClick={onDelete} className="p-1.5 hover:bg-[var(--color-popover)] rounded-lg">
              <X className="w-3.5 h-3.5 text-[var(--color-danger)]" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { Pencil, X } from 'lucide-react'

export default function MatchCard({ data, match, onEdit, onDelete, showControls = true }) {
  const item = data ?? match ?? {}
  const resultColors = {
    win: 'from-green-500 to-emerald-400',
    loss: 'from-red-500 to-pink-500',
    draw: 'from-gray-400 to-gray-500'
  }
    const resultKey = String(item.result ?? '').toLowerCase()
    const resultGradient = resultColors[resultKey] ?? 'from-gray-400 to-gray-500'
    const resultLabel = item.result ? String(item.result).charAt(0).toUpperCase() + String(item.result).slice(1).toLowerCase() : ''
  
  return (
    <div className="p-4 rounded-2xl border border-border hover:border-primary-bright transition-colors group bg-card">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
              {resultLabel ? (
                <div className={`px-3 py-1 rounded-lg bg-linear-to-r ${resultGradient} text-white text-xs font-bold uppercase`}>
                  {resultLabel}
                </div>
              ) : (
                <div className="px-3 py-1 rounded-lg bg-popover text-xs font-semibold">-</div>
              )}
            <div className="inline-flex items-center gap-2 text-sm font-bold text-foreground">
              <span>{item.score ?? '-'}</span>
            </div>
          </div>
          <h4 className="font-semibold text-foreground">vs {item.opponent ?? ''}</h4>
          <p className="text-xs text-muted-foreground mt-1">{item.date ? new Date(item.date).toLocaleDateString() : ''}</p>
          {item.performance && (
            <p className="text-sm text-foreground mt-2">{item.performance}</p>
          )}
        </div>
        {showControls && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={(e) => { e.stopPropagation(); onEdit && onEdit(); }} className="p-1.5 hover:bg-popover rounded-lg transition-colors">
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); onDelete && onDelete(); }} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
              <X className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

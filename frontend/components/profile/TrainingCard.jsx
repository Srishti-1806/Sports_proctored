"use client"

import { Pencil, X, Clock, Calendar } from 'lucide-react'

export default function TrainingCard({ data, training, onEdit, onDelete, showControls = true }) {
  const item = data ?? training ?? {}
  const intensityColors = {
    low: 'from-green-400 to-emerald-300',
    medium: 'from-yellow-400 to-orange-400',
    high: 'from-red-400 to-pink-500'
  }
  const intensity = item.intensity ?? 'medium'
  const name = item.name ?? ''
  const duration = item.duration ?? ''
  const frequency = item.frequency ?? ''

  return (
    <div className="p-4 rounded-2xl bg-linear-to-br from-primary-soft to-card border border-border/20 hover:border-primary-bright transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`inline-block px-2 py-1 rounded-lg bg-linear-to-r ${intensityColors[intensity]} text-white text-xs font-bold uppercase mb-2`}>
            {intensity}
          </div>
          <h4 className="font-semibold text-foreground mb-1">{name}</h4>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {duration}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {frequency}
            </div>
          </div>
        </div>
        {showControls && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 hover:bg-popover rounded-lg">
              <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded-lg">
              <X className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

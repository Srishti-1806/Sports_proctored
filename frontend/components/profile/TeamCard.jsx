"use client"

import { Users, Pencil, X } from 'lucide-react'

export default function TeamCard({ data, team, onEdit, onDelete, showControls = true }) {
  const item = data ?? team ?? {}
  const name = item.name ?? ''
  const startYear = item.startYear ?? item.start_year ?? ''
  const endYear = item.endYear ?? item.end_year ?? ''

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary-bright transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">{name}</h4>
          <p className="text-xs text-muted-foreground">{startYear} - {endYear}</p>
        </div>
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
  )
}

"use client"

import { Users, Pencil, X } from 'lucide-react'

export default function TeamCard({ data, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-primary-bright transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary-deep to-primary-bright flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm">{data.name}</h4>
          <p className="text-xs text-muted-foreground">{data.startYear} - {data.endYear}</p>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 hover:bg-popover rounded-lg">
          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded-lg">
          <X className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>
    </div>
  )
}

"use client"

import { Trophy, X } from 'lucide-react'

export default function AchievementBadge({ data, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-[#1a1a2e] text-sm">{data.title}</h4>
          <p className="text-xs text-amber-600">{data.year}</p>
        </div>
      </div>
      <button onClick={onDelete} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-opacity">
        <X className="w-3.5 h-3.5 text-red-500" />
      </button>
    </div>
  )
}

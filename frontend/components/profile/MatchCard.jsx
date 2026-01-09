"use client"

import { Pencil, X } from 'lucide-react'

export default function MatchCard({ data, onEdit, onDelete, showControls = true }) {
  const resultColors = {
    win: 'from-green-500 to-emerald-400',
    loss: 'from-red-500 to-pink-500',
    draw: 'from-gray-400 to-gray-500'
  }
  
  return (
    <div className="p-4 rounded-2xl border border-[#EDE8F5] hover:border-[#7091E6] transition-colors group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`px-3 py-1 rounded-lg bg-linear-to-r ${resultColors[data.result]} text-white text-xs font-bold uppercase`}>
              {data.result}
            </div>
            <span className="text-sm font-bold text-[#1a1a2e]">{data.score}</span>
          </div>
          <h4 className="font-semibold text-[#1a1a2e]">vs {data.opponent}</h4>
          <p className="text-xs text-[#8697C4] mt-1">{new Date(data.date).toLocaleDateString()}</p>
          {data.performance && (
            <p className="text-sm text-[#1a1a2e] mt-2">{data.performance}</p>
          )}
        </div>
        {showControls && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={onEdit} className="p-1.5 hover:bg-[#EDE8F5] rounded-lg">
              <Pencil className="w-3.5 h-3.5 text-[#8697C4]" />
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

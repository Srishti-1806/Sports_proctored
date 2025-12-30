"use client"

import { Pencil, X, Clock, Calendar } from 'lucide-react'

export default function TrainingCard({ data, onEdit, onDelete }) {
  const intensityColors = {
    low: 'from-green-400 to-emerald-300',
    medium: 'from-yellow-400 to-orange-400',
    high: 'from-red-400 to-pink-500'
  }
  
  return (
    <div className="p-4 rounded-2xl bg-linear-to-br from-[#EDE8F5] to-white border border-[#ADBBDA]/20 hover:border-[#7091E6] transition-colors group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`inline-block px-2 py-1 rounded-lg bg-linear-to-r ${intensityColors[data.intensity]} text-white text-xs font-bold uppercase mb-2`}>
            {data.intensity}
          </div>
          <h4 className="font-semibold text-[#1a1a2e] mb-1">{data.name}</h4>
          <div className="flex items-center gap-3 text-xs text-[#8697C4]">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.duration}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {data.frequency}
            </div>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 hover:bg-white rounded-lg">
            <Pencil className="w-3.5 h-3.5 text-[#8697C4]" />
          </button>
          <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded-lg">
            <X className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  )
}

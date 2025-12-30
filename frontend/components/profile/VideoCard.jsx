"use client"

import { Pencil, X, Play } from 'lucide-react'

export default function VideoCard({ data, onEdit, onDelete }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-[#EDE8F5] hover:border-[#7091E6] transition-colors">
      <div className="aspect-video bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center relative">
        <Play className="w-12 h-12 text-white" />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 bg-white/90 hover:bg-white rounded-lg">
            <Pencil className="w-3.5 h-3.5 text-[#3D52A0]" />
          </button>
          <button onClick={onDelete} className="p-1.5 bg-white/90 hover:bg-red-50 rounded-lg">
            <X className="w-3.5 h-3.5 text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-[#1a1a2e] text-sm mb-1">{data.title}</h4>
        {data.description && (
          <p className="text-xs text-[#8697C4] line-clamp-2">{data.description}</p>
        )}
      </div>
    </div>
  )
}

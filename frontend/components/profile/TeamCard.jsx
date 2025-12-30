"use client"

import { Users, Pencil, X } from 'lucide-react'

export default function TeamCard({ data, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-[#EDE8F5] hover:border-[#7091E6] transition-colors group">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#3D52A0] to-[#7091E6] flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-[#1a1a2e] text-sm">{data.name}</h4>
          <p className="text-xs text-[#8697C4]">{data.startYear} - {data.endYear}</p>
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-1.5 hover:bg-[#EDE8F5] rounded-lg">
          <Pencil className="w-3.5 h-3.5 text-[#8697C4]" />
        </button>
        <button onClick={onDelete} className="p-1.5 hover:bg-red-50 rounded-lg">
          <X className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>
    </div>
  )
}

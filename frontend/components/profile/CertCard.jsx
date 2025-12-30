"use client"

import { Shield, X } from 'lucide-react'

export default function CertCard({ data, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200 group hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-[#1a1a2e] text-sm">{data.name}</h4>
          <p className="text-xs text-blue-600">{data.issuer} • {data.year}</p>
        </div>
      </div>
      <button onClick={onDelete} className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded-lg transition-opacity">
        <X className="w-3.5 h-3.5 text-red-500" />
      </button>
    </div>
  )
}

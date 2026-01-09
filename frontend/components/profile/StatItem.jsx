"use client"

export default function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#EDE8F5]/50 hover:bg-[#EDE8F5] transition-colors">
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-[#3D52A0]" />
      </div>
      <div className="text-center">
        <div className="text-xs text-[#8697C4] font-medium">{label}</div>
        <div className="text-sm font-bold text-[#1a1a2e] mt-1">{value}</div>
      </div>
    </div>
  )
}

"use client"

export default function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary-soft/10 hover:bg-primary-soft/20 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center shadow-sm">
      <Icon className="w-5 h-5 text-primary-bright" />
      </div>
      <div className="text-center">
        <div className="text-xs text-muted-foreground font-medium">{label}</div>
        <div className="text-sm font-bold text-foreground mt-1">{value}</div>
      </div>
    </div>
  )
}

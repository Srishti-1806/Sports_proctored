"use client"

export default function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[var(--color-primary-soft)]/10 hover:bg-[var(--color-primary-soft)]/20 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-[var(--color-card)] flex items-center justify-center shadow-sm">
      <Icon className="w-5 h-5 text-[var(--color-primary-bright)]" />
      </div>
      <div className="text-center">
        <div className="text-xs text-[var(--color-muted-foreground,#8697C4)] font-medium">{label}</div>
        <div className="text-sm font-bold text-[var(--color-foreground)] mt-1">{value}</div>
      </div>
    </div>
  )
}

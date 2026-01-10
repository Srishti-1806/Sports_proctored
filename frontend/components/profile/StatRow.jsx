export default function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
      <span className="text-sm text-[var(--color-muted-foreground,#8697C4)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--color-foreground)]">{value}</span>
    </div>
  )
}

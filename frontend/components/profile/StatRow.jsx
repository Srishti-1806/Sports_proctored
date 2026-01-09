export default function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#EDE8F5] last:border-0">
      <span className="text-sm text-[#8697C4]">{label}</span>
      <span className="text-sm font-semibold text-[#1a1a2e]">{value}</span>
    </div>
  )
}

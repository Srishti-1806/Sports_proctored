export default function EmptyState({ message, text, small }) {
  const display = message || text || ''
  return (
    <div className={`text-center ${small ? 'py-4' : 'py-8'} text-[#8697C4]`}>
      <p className={`${small ? 'text-xs' : 'text-sm'}`}>{display}</p>
    </div>
  )
}

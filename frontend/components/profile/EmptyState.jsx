import { Plus } from 'lucide-react'

export default function EmptyState({ text, small }) {
  return (
    <div className={`text-center ${small ? 'py-4' : 'py-8'} text-[#8697C4]`}>
      <div className={`${small ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-2 rounded-full bg-[#EDE8F5] flex items-center justify-center`}>
        <Plus className={`${small ? 'w-6 h-6' : 'w-8 h-8'} text-[#ADBBDA]`} />
      </div>
      <p className={`${small ? 'text-xs' : 'text-sm'}`}>{text}</p>
    </div>
  )
}

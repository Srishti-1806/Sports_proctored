export default function TabsNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? 'bg-linear-to-r from-[var(--color-primary-deep)] to-[var(--color-primary-bright)] text-white shadow-lg'
              : 'bg-[var(--color-card)] text-[var(--color-muted,#8697C4)] hover:text-[var(--color-primary-deep)] hover:bg-[var(--color-popover)]'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  )
}

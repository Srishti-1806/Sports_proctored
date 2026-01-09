export default function TabsNavigation({ tabs, activeTab, setActiveTab }) {
  return (
    <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
            activeTab === tab.id
              ? 'bg-linear-to-r from-[#3D52A0] to-[#7091E6] text-white shadow-lg'
              : 'bg-white text-[#8697C4] hover:text-[#3D52A0] hover:bg-[#EDE8F5]'
          }`}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </button>
      ))}
    </div>
  )
}

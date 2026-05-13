import { useState } from 'react'
import Header from './components/Header.jsx'
import TabsNav from './components/TabsNav.jsx'
import TabNiveles from './tabs/TabNiveles.jsx'
import TabAnalisis from './tabs/TabAnalisis.jsx'
import TabFoda from './tabs/TabFoda.jsx'
import TabEmbudo from './tabs/TabEmbudo.jsx'

export default function App() {
  const [tab, setTab] = useState('niveles')
  const onChangeTab = (id) => {
    setTab(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen">
      <div className="max-w-6xl mx-auto p-3 sm:p-6 lg:p-10">
        <Header />
        <TabsNav activeTab={tab} onChange={onChangeTab} />
        {tab === 'niveles' && <TabNiveles />}
        {tab === 'analisis' && <TabAnalisis />}
        {tab === 'foda' && <TabFoda />}
        {tab === 'embudo' && <TabEmbudo />}
      </div>
    </div>
  )
}

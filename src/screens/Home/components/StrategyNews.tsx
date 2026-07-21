import { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

// Import components
import { HomeCalendar } from './HomeCalendar'
import { HomeNews } from './HomeNews'
import { HomeStrategy } from './HomeStrategy'

function StrategyNews() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'news' | 'strategy'>(
    'strategy',
  )

  const tabs = [
    { id: 'strategy' as const, label: 'Strategy' },
    { id: 'calendar' as const, label: 'Calendar' },
    { id: 'news' as const, label: 'News' },
  ]

  return (
    <View className='px-4 mt-8 pb-20'>
      {/* Main Tabs */}
      <View className='flex-row items-center mb-4 gap-x-3'>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              setActiveTab(tab.id)
            }}>
            <Text
              className={`typo-h3-${activeTab === tab.id ? 'semibold' : 'regular'} text-${activeTab === tab.id ? 'neutral-900' : 'neutral-400'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Render active tab component */}
      {activeTab === 'strategy' && <HomeStrategy />}

      {activeTab === 'calendar' && <HomeCalendar />}

      {activeTab === 'news' && <HomeNews />}
    </View>
  )
}

export default StrategyNews

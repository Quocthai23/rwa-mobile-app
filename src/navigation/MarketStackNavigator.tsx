import { createStackNavigator } from '@react-navigation/stack'

import { Paths } from '@/navigation/paths'
import type { MarketStackParamList } from '@/navigation/types'
import { Alerts, Market, SymbolDetail } from '@/screens'

const Stack = createStackNavigator<MarketStackParamList>()

function MarketStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={Paths.Market}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen component={Market} name={Paths.Market} />
      <Stack.Screen component={SymbolDetail} name={Paths.SymbolDetail} />
      <Stack.Screen component={Alerts} name={Paths.Alerts} />
    </Stack.Navigator>
  )
}

export default MarketStackNavigator

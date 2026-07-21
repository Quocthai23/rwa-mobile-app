import { ChevronLeft } from 'lucide-react-native'
import { useMemo, useRef, useState } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { captureRef } from 'react-native-view-shot'

import ReusableTabsPager, {
  type TabItem,
} from '@/components/atoms/Pager/ReusableTabsPager'
import { Text } from '@/components/atoms/TranslatedText/TranslatedText'
import ChartCommon from '@/components/chart/ChartCommon'
import NotifyIcon from '@/components/icons/NotifyIcon'
import ShareIcon from '@/components/icons/ShareIcon'
import { Paths } from '@/navigation/paths'
import type { MarketStackScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'
import AnalysisTab from './components/AnalysisTab'
import InfoTab from './components/InfoTab'
import ShareModal from './components/ShareModal'
import { ToggleFavouriteAsset } from '@/components/atoms'
import HomeFrame from '@/theme/assets/icons/home/Frame.svg'

type Props = MarketStackScreenProps<Paths.SymbolDetail>

function SymbolDetailScreen({ navigation, route }: Props) {
  const { colors } = useTheme()
  const { assetId, symbol, symbolDesc } = route.params
  const [currentSymbol, setCurrentSymbol] = useState(symbol)
  const [ohlc, setOhlc] = useState({ close: 0, high: 0, low: 0, open: 0 })
  const [showShareModal, setShowShareModal] = useState(false)
  const [capturedImageUri, setCapturedImageUri] = useState<null | string>(null)
  const screenReference = useRef<View>(null)

  const handleCapture = async () => {
    try {
      if (screenReference.current) {
        const uri = await captureRef(screenReference, {
          format: 'png',
          quality: 1,
        })
        setCapturedImageUri(uri)
        setShowShareModal(true)
      }
    } catch (error) {
      console.error('Failed to capture screenshot:', error)
    }
  }

  const tabs = useMemo<TabItem[]>(
    () => [
      {
        key: 'Market',
        label: 'Market',
        render: () => (
          <ChartCommon
            isShowPanel
            assetId={assetId}
            descSymbol={symbolDesc}
            isShowVolumeControl={false}
            isShowSelectSymbol={false}
            openTradePanelOnBuySell
            ohlcCb={setOhlc}
            setSymbol={setCurrentSymbol}
            symbol={currentSymbol}
          />
        ),
      },
      {
        key: 'Analysis',
        label: 'Analysis',
        render: <AnalysisTab />,
      },
      {
        key: 'Info',
        label: 'Info',
        render: <InfoTab assetId={assetId} />,
      },
    ],
    [currentSymbol, assetId],
  )
  const DEFAULT_INDEX = tabs.findIndex((t) => t.key === 'Market')

  return (
    <SafeAreaView className='flex-1 bg-white' edges={['top']}>
      <View ref={screenReference} className='flex-1' collapsable={false}>
        <View className='flex-row items-center justify-between px-4'>
          <View className='flex-row items-center gap-2'>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack()
              }}>
              <ChevronLeft size={24} />
            </TouchableOpacity>

            <View>
              <View className='flex-row items-center gap-1'>
                <Text className='text-h3-semibold font-semibold'>
                  {currentSymbol}
                </Text>
                <ToggleFavouriteAsset assetId={assetId ?? ''} />
              </View>
              <Text className='text-neutral-500'>{symbolDesc}</Text>
            </View>
          </View>

          <View className='flex-row gap-4 text-primary-500'>
            <ToggleFavouriteAsset assetId={assetId ?? ''} size={24} />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate(Paths.Alerts)
              }}>
              <NotifyIcon color={colors.neutral0} size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCapture}>
              <ShareIcon color={colors.neutral0} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        <ReusableTabsPager
          defaultIndex={Math.max(DEFAULT_INDEX, 0)}
          ohlc={ohlc}
          currentSymbol={currentSymbol}
          rightAction={
            <View className='flex-row items-end'>
              <TouchableOpacity>
                <HomeFrame color={colors.neutral700} className='w-6 h-6' />
              </TouchableOpacity>
            </View>
          }
          swipeEnabled={false}
          tabs={tabs}
          onIndexChange={(index, tab) => {}}
        />
      </View>

      <ShareModal
        imageUri={capturedImageUri}
        visible={showShareModal}
        onClose={() => {
          setShowShareModal(false)
        }}
      />
    </SafeAreaView>
  )
}

export default SymbolDetailScreen

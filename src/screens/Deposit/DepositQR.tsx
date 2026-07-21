import { ChevronLeft } from 'lucide-react-native'
import {
  Image,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import QRCodeStyled from 'react-native-qrcode-styled'
import { SafeAreaView } from 'react-native-safe-area-context'

import ButtonCustom from '@/components/atoms/Button/ButtonCustom'
import CopyIcon from '@/components/icons/CopyIcon'
import { CHAINS_NAME, TOKEN_NAME } from '@/constants/chain'
import { useToast } from '@/hooks/useToast'
import { type Paths } from '@/navigation/paths'
import type { RootScreenProps } from '@/navigation/types'
import { useTheme } from '@/theme'
import { setString } from '@/utils/clipboard'

function DepositQR({ navigation, route }: RootScreenProps<Paths.DepositQR>) {
  const { colors } = useTheme()
  const { showToast } = useToast()
  const { address, currency, network } = route.params

  const truncateAddress = (addr: string) => {
    if (!addr || addr.length < 12) return addr

    return `${addr.slice(0, 8)}...${addr.slice(-6)}`
  }

  const handleCopy = async () => {
    await setString(address)
    showToast({
      position: 'bottom',
      title: 'Address copied to clipboard',
    })
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My ${currency} (${network}) wallet address: ${address}`,
      })
    } catch (error) {
      console.error('Share failed:', error)
    }
  }

  return (
    <SafeAreaView className='flex-1 bg-neutral-0' edges={['top', 'bottom']}>
      {/* Header */}
      <View className='h-[58px] px-4 flex-row items-center justify-center gap-2'>
        <Pressable
          className='absolute left-4'
          onPress={() => navigation.goBack()}>
          <ChevronLeft color={colors.neutral700} size={24} />
        </Pressable>
        <Image
          className='w-[30px] aspect-square'
          source={require('@/assets/images/tether.png')}
        />
        <Text className='text-h3-semibold' style={{ color: colors.neutral900 }}>
          Deposit To
        </Text>
      </View>

      <View className='flex-1 justify-center items-center'>
        {/* <QRCode
              backgroundColor='white'
              color='black'
              logo={require('@/assets/images/tether.png')}
              logoBackgroundColor='white'
              logoBorderRadius={20}
              logoSize={40}
              size={200}
              value={address}
            /> */}

        <Text className='text-body-regular text-gray-900 mb-4'>
          Deposit amount must be at least{' '}
          <Text className='font-semibold'>$10 USDT</Text>
        </Text>
        <QRCodeStyled
          data={address}
          size={242}
          padding={20}
          color='#0F172A'
          // logo={{
          //   href: require('@/assets/images/tether.png'),
          // }}
          pieceBorderRadius={4}
          outerEyesOptions={{
            borderRadius: 12,
            // borderWidth: 2,
          }}
          innerEyesOptions={{
            borderRadius: 6,
          }}
        />

        <View className='w-fit flex-row items-center gap-2 justify-center h-[40px] px-3 rounded bg-neutral-100 mt-2'>
          <Text className='text-button-semibold'>
            {truncateAddress(address)}
          </Text>
          <TouchableOpacity onPress={handleCopy}>
            <CopyIcon size={20} color={colors.neutral100} />
          </TouchableOpacity>
        </View>

        <View
          className='items-center mt-6
        '>
          <Text className='text-body-semibold text-gray-900'>
            Send only USDT via{' '}
            <Text className='text-error-500'>
              {CHAINS_NAME?.[Number(network) ?? '']} (
              {TOKEN_NAME?.[Number(network) ?? '']})
            </Text>{' '}
            network
          </Text>
          <Text className='text-body-small-medium text-neutral-500'>
            Funds sent incorrectly cannot be recovered.
          </Text>
        </View>
      </View>

      <View className='flex-row w-full gap-4 px-4 h-[88px] items-center'>
        <ButtonCustom onPress={handleCopy} type={'CANCEL'}>
          <Text className='text-gray-900 text-button-medium'>Copy address</Text>
        </ButtonCustom>
        <ButtonCustom onPress={handleShare} type={'CANCEL'}>
          <Text className='text-gray-900 text-button-medium'>Share</Text>
        </ButtonCustom>
      </View>
    </SafeAreaView>
  )
}

export default DepositQR

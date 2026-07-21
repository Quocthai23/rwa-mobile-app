import { Info } from 'lucide-react-native'
import {
  Dimensions,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import type { ToastConfig } from 'react-native-toast-message'

import { information, neutral } from '@/theme/colors'

const TOAST_ICON_SUCCESS = require('@/assets/images/toast-success.png')
const TOAST_ICON_ERROR = require('@/assets/images/toast-error.png')
const TOAST_ICON_WARNING = require('@/assets/images/toast-warning.png')

const TABLET_BREAKPOINT = 768
const TABLET_TOAST_MAX_WIDTH = 400

// Design Figma: surface #030712, radius 4px
const TOAST_BG = neutral[1000]
const TOAST_RADIUS = 4
const TITLE_COLOR = neutral[0]
const SUBTITLE_COLOR = neutral[300]

// Design: padding 12/8, icon container 24px (icon 20px), gap 8px, title-subtitle gap 2px
const PADDING_H = 12
const PADDING_V = 8
const ICON_CONTAINER_SIZE = 24
const ICON_SIZE = 20
const GAP_ICON_TEXT = 8
const GAP_TITLE_SUBTITLE = 2

// Shadow khi có subtitle: 0px 4px 12px rgba(0, 0, 0, 0.10)
const toastShadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  android: {
    elevation: 4,
  },
})

// Design: title 15px/600/24px, subtitle 14px/400/20px
const TITLE_FONT_SIZE = 15
const TITLE_LINE_HEIGHT = 24
const SUBTITLE_FONT_SIZE = 14
const SUBTITLE_LINE_HEIGHT = 20

type ToastType = 'success' | 'error' | 'warning' | 'info'

function ToastIconImage({ type }: { type: 'success' | 'error' | 'warning' }) {
  const source =
    type === 'success'
      ? TOAST_ICON_SUCCESS
      : type === 'error'
        ? TOAST_ICON_ERROR
        : TOAST_ICON_WARNING

  return (
    <View
      style={{
        width: ICON_CONTAINER_SIZE,
        height: ICON_CONTAINER_SIZE,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Image
        resizeMode='contain'
        source={source}
        style={{ width: ICON_SIZE, height: ICON_SIZE }}
      />
    </View>
  )
}

function getToastWidth() {
  const { width } = Dimensions.get('window')

  if (width >= TABLET_BREAKPOINT) {
    return TABLET_TOAST_MAX_WIDTH
  }

  // Full device width với margin nhỏ 2 bên (12px mỗi bên)
  return width - 24
}

type ToastProps = {
  text1?: string
  text2?: string
  onPress?: () => void
  type: ToastType
}

function CustomToast({ text1, text2, onPress, type }: ToastProps) {
  const hasSubtitle = Boolean(text2?.length)
  const toastWidth = getToastWidth()

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={[
        {
          width: toastWidth,
          backgroundColor: TOAST_BG,
          borderRadius: TOAST_RADIUS,
          paddingHorizontal: PADDING_H,
          paddingVertical: PADDING_V,
          flexDirection: 'row',
          alignItems: 'center',
        },
        hasSubtitle ? toastShadow : {},
      ]}
      onPress={onPress}>
      <View style={{ marginRight: GAP_ICON_TEXT }}>
        {type === 'info' ? (
          <View
            style={{
              width: ICON_CONTAINER_SIZE,
              height: ICON_CONTAINER_SIZE,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Info color={information[500]} size={ICON_SIZE} strokeWidth={2} />
          </View>
        ) : (
          <ToastIconImage type={type} />
        )}
      </View>
      <View style={{ flex: 1, gap: GAP_TITLE_SUBTITLE }}>
        {text1 ? (
          <Text
            numberOfLines={1}
            style={{
              color: TITLE_COLOR,
              fontSize: TITLE_FONT_SIZE,
              fontWeight: hasSubtitle ? '600' : '500',
              lineHeight: TITLE_LINE_HEIGHT,
            }}>
            {text1}
          </Text>
        ) : null}
        {text2 ? (
          <Text
            numberOfLines={3}
            style={{
              color: SUBTITLE_COLOR,
              fontSize: SUBTITLE_FONT_SIZE,
              fontWeight: '400',
              lineHeight: SUBTITLE_LINE_HEIGHT,
            }}>
            {text2}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

function createToastRenderer(type: ToastType): ToastConfig[keyof ToastConfig] {
  return (props: { text1?: string; text2?: string; onPress?: () => void }) => (
    <CustomToast
      text1={props.text1}
      text2={props.text2}
      type={type}
      onPress={props.onPress}
    />
  )
}

export const toastConfig: ToastConfig = {
  success: createToastRenderer('success'),
  error: createToastRenderer('error'),
  info: createToastRenderer('info'),
  warning: createToastRenderer('warning'),
}

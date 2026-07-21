import { useTheme } from '@/theme'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Share from 'react-native-share'

type ShareModalProps = {
  readonly imageUri: null | string
  readonly onClose: () => void
  readonly visible: boolean
}

function ShareModal({ imageUri, onClose, visible }: ShareModalProps) {
  const { colors } = useTheme()
  const handleSaveImage = async () => {
    if (!imageUri) return
    try {
      await CameraRoll.save(imageUri, { type: 'photo' })
      Alert.alert('Success', 'Image saved to gallery!')
      onClose()
    } catch (error: any) {
      console.error('Failed to save image:', error)
      if (error.message?.includes('Permission')) {
        Alert.alert(
          'Permission Required',
          'Please allow access to save images to your photo library in Settings',
        )
      } else {
        Alert.alert(
          'Error',
          `Failed to save image: ${error.message || 'Unknown error'}`,
        )
      }
    }
  }

  const handleShareTo = async (social: string) => {
    if (!imageUri) return
    try {
      const options: any = {
        message: 'Check out this chart',
        title: 'Share Chart',
        type: 'image/png',
        url: imageUri,
      }

      if (social === 'GENERAL') {
        await Share.open(options)
      } else {
        options.social = Share.Social[social as keyof typeof Share.Social]
        await Share.shareSingle(options)
      }
      onClose()
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        console.error('Failed to share:', error)
      }
    }
  }

  return (
    <Modal
      transparent
      animationType='fade'
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          {/* Image Preview - Scrollable */}
          <ScrollView
            contentContainerStyle={styles.imageContent}
            showsVerticalScrollIndicator={false}
            style={styles.imageContainer}>
            {imageUri ? (
              <Image
                resizeMode='contain'
                source={{ uri: imageUri }}
                style={styles.previewImage}
              />
            ) : null}
          </ScrollView>

          {/* Bottom Sheet */}
          <View style={styles.bottomSheet}>
            <Text style={styles.shareTitle}>Share image</Text>

            {/* First Row */}
            <View style={styles.shareRow}>
              <TouchableOpacity
                style={styles.shareOption}
                onPress={handleSaveImage}>
                <View style={styles.shareIconBg}>
                  <Text style={styles.shareIconText}>↓</Text>
                </View>
                <Text style={styles.shareLabel}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareTo('WHATSAPP')}>
                <View
                  style={[
                    styles.shareIconBg,
                    { backgroundColor: colors.success500 },
                  ]}>
                  <Text style={styles.shareIconText}>W</Text>
                </View>
                <Text style={styles.shareLabel}>Whats App</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareTo('FACEBOOK')}>
                <View
                  style={[
                    styles.shareIconBg,
                    { backgroundColor: colors.primary500 },
                  ]}>
                  <Text style={styles.shareIconText}>f</Text>
                </View>
                <Text style={styles.shareLabel}>Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareTo('MESSENGER')}>
                <View
                  style={[
                    styles.shareIconBg,
                    { backgroundColor: colors.primary500 },
                  ]}>
                  <Text style={styles.shareIconText}>m</Text>
                </View>
                <Text style={styles.shareLabel}>Messenger</Text>
              </TouchableOpacity>
            </View>

            {/* Second Row */}
            <View style={styles.shareRow}>
              <TouchableOpacity style={styles.shareOption}>
                <View
                  style={[
                    styles.shareIconBg,
                    { backgroundColor: colors.primary500 },
                  ]}>
                  <Text style={styles.shareIconText}>D</Text>
                </View>
                <Text style={styles.shareLabel}>Discord</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareTo('TELEGRAM')}>
                <View
                  style={[
                    styles.shareIconBg,
                    { backgroundColor: colors.primary500 },
                  ]}>
                  <Text style={styles.shareIconText}>T</Text>
                </View>
                <Text style={styles.shareLabel}>Telegram</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareTo('TWITTER')}>
                <View
                  style={[
                    styles.shareIconBg,
                    { backgroundColor: colors.neutral900 },
                  ]}>
                  <Text style={styles.shareIconText}>X</Text>
                </View>
                <Text style={styles.shareLabel}>X</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareOption}
                onPress={() => handleShareTo('INSTAGRAM')}>
                <View
                  style={[
                    styles.shareIconBg,
                    { backgroundColor: colors.error500 },
                  ]}>
                  <Text style={styles.shareIconText}>I</Text>
                </View>
                <Text style={styles.shareLabel}>Instagram</Text>
              </TouchableOpacity>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cancelButton: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 12,
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    // backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    flex: 1,
  },
  imageContent: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  previewImage: {
    backgroundColor: '#FFFFFF',
    height: 600,
    paddingTop: 20,
    width: '100%',
  },
  shareIconBg: {
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    marginBottom: 8,
    width: 56,
  },
  shareIconText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  shareLabel: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center',
  },
  shareOption: {
    alignItems: 'center',
    width: 70,
  },
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  shareTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
})

export default ShareModal

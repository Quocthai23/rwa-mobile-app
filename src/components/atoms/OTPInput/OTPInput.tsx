import { useRef, useState } from 'react'
import { TextInput, View } from 'react-native'

type OTPInputProps = {
  readonly length?: number
  readonly onChangeText?: ((otp: string) => void) | undefined
  readonly onComplete?: ((otp: string) => void) | undefined
}

export function OTPInput({
  length = 6,
  onChangeText,
  onComplete,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const inputReferences = useRef<(null | TextInput)[]>([])

  const handleChangeText = (text: string, index: number) => {
    // Only allow digits
    const digit = text.replaceAll(/\D/g, '')
    if (digit.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    const otpString = newOtp.join('')
    onChangeText?.(otpString)

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputReferences.current[index + 1]?.focus()
    }

    // Call onComplete if all fields are filled
    if (
      otpString.length === length &&
      otpString.split('').every((d) => d !== '')
    ) {
      onComplete?.(otpString)
    }
  }

  const handleKeyPress = (key: string, index: number) => {
    // Handle backspace
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputReferences.current[index - 1]?.focus()
    }
  }

  return (
    <View className='flex-row justify-center gap-3'>
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(reference) => {
            inputReferences.current[index] = reference
          }}
          className='w-12 h-14 border-2 border-gray-300 rounded-lg text-center text-xl font-bold bg-gray-50'
          keyboardType='number-pad'
          maxLength={1}
          value={otp[index]}
          onChangeText={(text) => {
            handleChangeText(text, index)
          }}
          onKeyPress={({ nativeEvent }) => {
            handleKeyPress(nativeEvent.key, index)
          }}
        />
      ))}
    </View>
  )
}

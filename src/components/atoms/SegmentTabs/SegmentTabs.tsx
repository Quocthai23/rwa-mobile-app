import { Pressable, Text, View } from 'react-native'
import { twMerge } from 'tailwind-merge'

export function SegmentTabs({
  activeButtonClassName,
  activeLabelClassName,
  buttonClassName,
  className,
  labelClassName,
  onChanged,
  options,
  selected,
}: {
  readonly activeButtonClassName?: string
  readonly activeLabelClassName?: string
  readonly buttonClassName?: string
  readonly className?: string
  readonly labelClassName?: string
  readonly onChanged: (value: string) => void
  readonly options: { label: string; value: string }[]
  readonly selected: string
}) {
  return (
    <View
      className={twMerge(
        'flex-row bg-neutral-100 p-1 rounded mb-6',
        className,
      )}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          className={twMerge(
            'flex-1 py-2 rounded-[4px] items-center',
            buttonClassName,
            selected === option.value ? 'bg-white' : undefined,
            selected === option.value ? activeButtonClassName : undefined,
          )}
          onPress={() => {
            onChanged(option.value)
          }}>
          <Text
            className={twMerge(
              'font-medium text-base text-neutral-900',
              labelClassName,
              selected === option.value ? activeLabelClassName : undefined,
            )}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

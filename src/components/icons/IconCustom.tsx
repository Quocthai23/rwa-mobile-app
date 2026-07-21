import type { ComponentType } from 'react'

import {
  Account1Svg,
  Account2Svg,
  ChatSvg,
  CopyTradingSvg,
  DepositSvg,
  FeedbackSvg,
  HelpSvg,
  InfoSvg,
  RankingSvg,
  ReferralSvg,
  RewardHubSvg,
  SocialSvg,
  TransferSvg,
  WithdrawSvg,
  HistorySvg,
} from '@/assets/icons'

type SvgProps = {
  color?: string
  fill?: string
  height?: number
  width?: number
}

const ICONS = {
  account1: Account1Svg,
  account2: Account2Svg,
  chat: ChatSvg,
  copy_trading: CopyTradingSvg,
  deposit: DepositSvg,
  feedback: FeedbackSvg,
  help: HelpSvg,
  info: InfoSvg,
  ranking: RankingSvg,
  referral: ReferralSvg,
  reward_hub: RewardHubSvg,
  social: SocialSvg,
  transfer: TransferSvg,
  withdraw: WithdrawSvg,
  history: HistorySvg,
} satisfies Record<string, ComponentType<SvgProps>>

export type IconName = keyof typeof ICONS

type Props = {
  readonly color?: string
  readonly fill?: string
  readonly name: IconName
  readonly size?: number
}

export function IconCustom({ color, fill, name, size = 24 }: Props) {
  const Comp = ICONS[name]

  return <Comp color={color} fill={fill} height={size} width={size} />
}

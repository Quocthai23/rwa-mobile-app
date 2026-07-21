import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'

import type { Paths } from '@/navigation/paths'
import { type Account } from '@/types/account'
import { type Position } from '@/types/position'

export type MarketStackParamList = {
  [Paths.Market]: undefined
  [Paths.SymbolDetail]: {
    assetId?: string
    isFavorite?: boolean
    symbol: string
    symbolDesc?: string
  }
  [Paths.Alerts]: undefined
  [Paths.Search]: undefined
}

export type DiscoverTabId = 'Calendar' | 'News' | 'Strategy'

export type MainTabParamList = {
  [Paths.Discover]: { initialTab?: DiscoverTabId } | undefined
  [Paths.Home]: undefined
  [Paths.Market]: NavigatorScreenParams<MarketStackParamList> | undefined
  [Paths.Positions]: undefined
  [Paths.Trade]: undefined
}

export type MarketStackScreenProps<
  S extends keyof MarketStackParamList = keyof MarketStackParamList,
> = CompositeScreenProps<
  StackScreenProps<MarketStackParamList, S>,
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList>,
    StackScreenProps<RootStackParamList>
  >
>

export type MainTabScreenProps<
  S extends keyof MainTabParamList = keyof MainTabParamList,
> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, S>,
  StackScreenProps<RootStackParamList>
>

export type RootScreenProps<
  S extends keyof RootStackParamList = keyof RootStackParamList,
> = StackScreenProps<RootStackParamList, S>

export type RootStackParamList = {
  [Paths.Alerts]: undefined
  [Paths.CalendarDetail]: {
    event: import('@/types/calendar').CalendarEvent
  }
  [Paths.CalendarList]: {
    activeSubTab: string
    selectedDate: string
  }
  [Paths.ChangePINCode]: undefined
  [Paths.ChangePassword]: undefined
  [Paths.ConfirmDeleteTradeAccount]: { account: Account }
  [Paths.CreateAccountDetail]: { accountType: 'Demo' | 'Live' }
  [Paths.CreatePINCode]: undefined
  [Paths.ConfirmPINCode]: { pin: string }
  [Paths.FinishCreatePIN]: undefined
  [Paths.EnterPIN]: undefined
  [Paths.Deposit]: undefined
  [Paths.DepositDetail]: { methodId: string; methodName: string }
  [Paths.DepositFailure]: {
    errorCode?: string
    errorMessage: string
  }
  [Paths.DepositQR]: {
    address: string
    amount: string
    currency: string
    network: string
  }
  [Paths.DepositTo]: {
    chainId: number
  }
  [Paths.DepositSuccess]: {
    accountId: string
    amount: string
    availableBalance: string
    balance: string
  }
  [Paths.EditNickname]: { account: Account; initialNickname?: string }
  [Paths.Feedback]: undefined
  [Paths.GoogleAuthenticator]: undefined
  [Paths.Home]: undefined
  [Paths.LockAccount]: undefined
  [Paths.Login]: { fromDiscover?: boolean } | undefined
  [Paths.Main]: NavigatorScreenParams<MainTabParamList> | undefined
  [Paths.ManageAccounts]: undefined
  [Paths.More]: undefined
  [Paths.NewsList]: {
    activeSubTab: string
  }
  [Paths.NewsWebView]: {
    title: string
    url: string
  }
  [Paths.Referral]: undefined
  [Paths.MyReferral]: undefined
  [Paths.RewardStructure]: undefined
  [Paths.RewardsCenter]: undefined
  [Paths.Social]: undefined
  [Paths.CopyTrading]: undefined
  [Paths.Chat]: undefined
  [Paths.Commission]: undefined
  [Paths.Notifications]: undefined
  [Paths.Onboarding]: undefined
  [Paths.PersonalInfo]: undefined
  [Paths.MyReferrer]: undefined
  [Paths.PositionDetails]: {
    position: Position
  }
  [Paths.Positions]: undefined
  [Paths.Ranking]: undefined
  [Paths.Register]: undefined
  [Paths.RegisterCreatePassword]: { email?: string; registerToken?: string }
  [Paths.RegisterReferralCode]: {
    email?: string
    registerToken?: string
    password?: string
  }
  [Paths.RegisterInput]: undefined
  [Paths.RegisterVerifyOTP]: {
    email?: string
    password?: string
    phone?: string
    registerToken?: string
  }
  [Paths.ForgotPasswordSendOTP]: undefined
  [Paths.ForgotPasswordVerifyOTP]: {
    email: string
  }
  [Paths.ForgotPasswordCreateNewPassword]: {
    email: string
    resetPasswordToken: string
  }
  [Paths.Search]: undefined
  [Paths.SecurityCenter]: undefined
  [Paths.SetFundPassword]: undefined
  [Paths.Setting]: undefined
  [Paths.SetUpPIN]: undefined
  [Paths.Startup]: undefined
  [Paths.SymbolDetail]: {
    assetId?: string
    isFavorite?: boolean
    symbol: string
    symbolDesc?: string
  }
  [Paths.TopUp]: undefined
  [Paths.TradeAccountAbout]: { account: Account }
  [Paths.Transaction]: {
    assetId?: string
    symbol: string
    type: 'buy' | 'sell'
  }
  [Paths.TransactionHistory]: undefined
  [Paths.Transfer]: {
    transferType: 'other_account' | 'your_account'
  }
  [Paths.TransferFailure]: {
    errorCode?: string
    errorMessage: string
  }
  [Paths.TransferSuccess]: {
    amount: string
    fromAccountId: string
    recipientEmail?: string
    toAccountId: string
  }
  [Paths.ModifyOpeningOrder]: {
    position: any
  }
  [Paths.OpeningOrder]: {
    position: Position
    tab?: 'close_position' | 'open_position'
    orderTypeDefault?: string
  }
  [Paths.Withdraw]: undefined
  [Paths.WithdrawConfirm]: undefined
  [Paths.WithdrawDetail]: { chainId: string }
  [Paths.WithdrawPending]: {
    withdrawData: import('@/types/payment').WithdrawResponse
  }
  [Paths.WithdrawRisk]: undefined
  [Paths.WithdrawSuccess]: {
    withdrawData: import('@/types/payment').WithdrawResponse
  }
  [Paths.WithdrawFailed]: undefined
}

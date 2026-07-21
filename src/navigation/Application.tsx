import * as BottomSheet from '@gorhom/bottom-sheet'
import {
  CommonActions,
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import type { ReactNode } from 'react'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'

import GlobalModal from '@/components/atoms/GlobalModal'
import { usePINGuard } from '@/hooks/usePINGuard'
import { Paths } from '@/navigation/paths'
import type { RootStackParamList } from '@/navigation/types'
import {
  Alerts,
  CalendarDetail,
  CalendarList,
  ChangePINCode,
  Chat,
  Commission,
  ConfirmPINCode,
  CopyTrading,
  CreatePINCode,
  DepositDetail,
  DepositQR,
  DepositSelection,
  EnterPIN,
  Feedback,
  FinishCreatePIN,
  ForgotPasswordCreateNewPassword,
  ForgotPasswordSendOTP,
  ForgotPasswordVerifyOTP,
  ModifyOpeningOrder,
  MyReferrer,
  MyReferral,
  RewardStructure,
  // ManageAccounts,
  NewsList,
  NewsWebView,
  Notifications,
  OpeningOrder,
  PersonalInfo,
  Positions,
  Ranking,
  Referral,
  RegisterCreatePassword,
  RegisterInput,
  RegisterReferralCode,
  RegisterVerifyOTP,
  RewardsCenter,
  Search,
  Setting,
  Social,
  TopUp,
  Transaction,
  TransactionHistory,
  WithdrawConfirm,
  WithdrawDetail,
  WithdrawPending,
  WithdrawRisk,
  WithdrawSelection,
  WithdrawSuccess,
} from '@/screens'
import ChangePassword from '@/screens/ChangePassword/ChangePassword'
import SetUpPIN from '@/screens/CreatePIN/SetUpPIN'
import DepositFailure from '@/screens/Deposit/DepositFailure'
import DepositSuccess from '@/screens/Deposit/DepositSuccess'
import DepositTo from '@/screens/Deposit/DepositTo'
import GoogleAuthenticator from '@/screens/GoogleAuthenticator/GoogleAuthenticator'
import LockAccount from '@/screens/LockAccount/LockAccount'
import Login from '@/screens/Login/Login'
import ConfirmDeleteTradeAccount from '@/screens/ManageAccounts/ConfirmDeleteTradeAccount'
import CreateAccountDetail from '@/screens/ManageAccounts/CreateAccountDetail'
import EditNickname from '@/screens/ManageAccounts/EditNickname'
import TradeAccountAbout from '@/screens/ManageAccounts/TradeAccountAbout'
import More from '@/screens/More/More'
import Onboarding from '@/screens/Onboarding/Onboarding'
import Register from '@/screens/Register/Register'
import SecurityCenter from '@/screens/SecurityCenter/SecurityCenter'
import SetFundPassword from '@/screens/SetFundPassword/SetFundPassword'
import Startup from '@/screens/Startup/Startup'
import Transfer from '@/screens/Transfer/Transfer'
import TransferFailure from '@/screens/Transfer/TransferFailure'
import TransferSuccess from '@/screens/Transfer/TransferSuccess'
import { useAuthStore } from '@/store/authStore'
import { useAppStore } from '@/store/useAppStore'
import { useTheme } from '@/theme'
import { toastConfig } from '@/utils/toastConfig'

import MainNavigator from './MainNavigator'

const Stack = createStackNavigator<RootStackParamList>()
const navigationRef = createNavigationContainerRef<RootStackParamList>()

const BottomSheetModalProviderSafe =
  BottomSheet?.BottomSheetModalProvider ??
  (({ children }: { children: ReactNode }) => <>{children}</>)

function SafeToast() {
  const insets = useSafeAreaInsets()

  return <Toast config={toastConfig} topOffset={insets.top + 10} />
}

function ApplicationNavigator() {
  const { navigationTheme, variant } = useTheme()
  const language = useAppStore((s) => s.language)
  const languageKey = language ?? 'en-EN'
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Handle PIN guard when app returns from background
  usePINGuard({
    onPINRequired: () => {
      // Only navigate to EnterPIN if user is authenticated and navigation is ready
      if (isAuthenticated && navigationRef.isReady()) {
        navigationRef.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: Paths.EnterPIN }],
          }),
        )
      }
    },
  })

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef} theme={navigationTheme}>
        <BottomSheetModalProviderSafe>
          <GlobalModal />
          <Stack.Navigator
            key={`${variant}-${languageKey}`}
            screenOptions={{ headerShown: false }}>
            <Stack.Screen component={Startup} name={Paths.Startup} />
            <Stack.Screen component={Onboarding} name={Paths.Onboarding} />
            <Stack.Screen component={Login} name={Paths.Login} />
            <Stack.Screen component={Register} name={Paths.Register} />
            <Stack.Screen
              component={RegisterInput}
              name={Paths.RegisterInput}
            />
            <Stack.Screen component={SetUpPIN} name={Paths.SetUpPIN} />
            <Stack.Screen
              component={RegisterVerifyOTP}
              name={Paths.RegisterVerifyOTP}
            />
            <Stack.Screen
              component={CreatePINCode}
              name={Paths.CreatePINCode}
            />
            <Stack.Screen
              component={ConfirmPINCode}
              name={Paths.ConfirmPINCode}
            />
            <Stack.Screen
              component={FinishCreatePIN}
              name={Paths.FinishCreatePIN}
            />
            <Stack.Screen component={EnterPIN} name={Paths.EnterPIN} />
            <Stack.Screen
              component={RegisterCreatePassword}
              name={Paths.RegisterCreatePassword}
            />
            <Stack.Screen
              component={RegisterReferralCode}
              name={Paths.RegisterReferralCode}
            />
            <Stack.Screen
              component={ForgotPasswordSendOTP}
              name={Paths.ForgotPasswordSendOTP}
            />
            <Stack.Screen
              component={ForgotPasswordVerifyOTP}
              name={Paths.ForgotPasswordVerifyOTP}
            />
            <Stack.Screen
              component={ForgotPasswordCreateNewPassword}
              name={Paths.ForgotPasswordCreateNewPassword}
            />
            <Stack.Screen
              component={MainNavigator}
              name={Paths.Main}
              options={{}}
            />
            <Stack.Screen component={Search} name={Paths.Search} />
            <Stack.Screen
              component={CalendarDetail}
              name={Paths.CalendarDetail}
            />
            <Stack.Screen component={CalendarList} name={Paths.CalendarList} />
            <Stack.Screen component={NewsList} name={Paths.NewsList} />
            <Stack.Screen component={NewsWebView} name={Paths.NewsWebView} />
            <Stack.Screen component={Referral} name={Paths.Referral} />
            <Stack.Screen component={MyReferral} name={Paths.MyReferral} />
            <Stack.Screen
              component={RewardStructure}
              name={Paths.RewardStructure}
            />
            <Stack.Screen
              component={RewardsCenter}
              name={Paths.RewardsCenter}
            />
            <Stack.Screen component={Social} name={Paths.Social} />
            <Stack.Screen component={CopyTrading} name={Paths.CopyTrading} />
            <Stack.Screen component={Chat} name={Paths.Chat} />
            <Stack.Screen component={Commission} name={Paths.Commission} />
            <Stack.Screen
              component={ModifyOpeningOrder}
              name={Paths.ModifyOpeningOrder}
            />
            <Stack.Screen component={OpeningOrder} name={Paths.OpeningOrder} />
            <Stack.Screen component={TopUp} name={Paths.TopUp} />
            <Stack.Screen component={Alerts} name={Paths.Alerts} />
            <Stack.Screen component={Transaction} name={Paths.Transaction} />
            <Stack.Screen
              component={TransactionHistory}
              name={Paths.TransactionHistory}
            />
            {/* <Stack.Screen
              component={ManageAccounts}
              name={Paths.ManageAccounts}
            /> */}
            <Stack.Screen component={More} name={Paths.More} />
            <Stack.Screen component={Setting} name={Paths.Setting} />
            <Stack.Screen component={Feedback} name={Paths.Feedback} />
            <Stack.Screen component={PersonalInfo} name={Paths.PersonalInfo} />
            <Stack.Screen component={MyReferrer} name={Paths.MyReferrer} />
            <Stack.Screen
              component={Notifications}
              name={Paths.Notifications}
            />
            <Stack.Screen component={Ranking} name={Paths.Ranking} />
            <Stack.Screen component={Transfer} name={Paths.Transfer} />
            <Stack.Screen
              component={TransferSuccess}
              name={Paths.TransferSuccess}
            />
            <Stack.Screen
              component={TransferFailure}
              name={Paths.TransferFailure}
            />
            <Stack.Screen
              component={WithdrawDetail}
              name={Paths.WithdrawDetail}
            />

            <Stack.Screen
              component={WithdrawConfirm}
              name={Paths.WithdrawConfirm}
            />
            <Stack.Screen
              component={WithdrawSuccess}
              name={Paths.WithdrawSuccess}
            />
            <Stack.Screen
              component={WithdrawPending}
              name={Paths.WithdrawPending}
            />
            <Stack.Screen
              component={ChangePINCode}
              name={Paths.ChangePINCode}
            />
            <Stack.Screen
              component={ChangePassword}
              name={Paths.ChangePassword}
            />
            <Stack.Screen
              component={GoogleAuthenticator}
              name={Paths.GoogleAuthenticator}
            />
            <Stack.Screen component={LockAccount} name={Paths.LockAccount} />
            <Stack.Screen
              component={SecurityCenter}
              name={Paths.SecurityCenter}
            />
            <Stack.Screen
              component={SetFundPassword}
              name={Paths.SetFundPassword}
            />
            <Stack.Screen
              component={CreateAccountDetail}
              name={Paths.CreateAccountDetail}
            />
            <Stack.Screen component={EditNickname} name={Paths.EditNickname} />
            <Stack.Screen
              component={TradeAccountAbout}
              name={Paths.TradeAccountAbout}
            />
            <Stack.Screen component={Positions} name={Paths.Positions} />
            <Stack.Screen
              component={ConfirmDeleteTradeAccount}
              name={Paths.ConfirmDeleteTradeAccount}
            />

            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen component={DepositSelection} name={Paths.Deposit} />
              <Stack.Screen
                component={DepositDetail}
                name={Paths.DepositDetail}
              />
              <Stack.Screen component={DepositQR} name={Paths.DepositQR} />
              <Stack.Screen component={DepositTo} name={Paths.DepositTo} />
              <Stack.Screen
                component={DepositSuccess}
                name={Paths.DepositSuccess}
              />
              <Stack.Screen
                component={DepositFailure}
                name={Paths.DepositFailure}
              />

              <Stack.Screen
                component={WithdrawSelection}
                name={Paths.Withdraw}
              />
              <Stack.Screen
                component={WithdrawRisk}
                name={Paths.WithdrawRisk}
              />
            </Stack.Group>
          </Stack.Navigator>
        </BottomSheetModalProviderSafe>
      </NavigationContainer>
      <SafeToast />
    </SafeAreaProvider>
  )
}

export default ApplicationNavigator

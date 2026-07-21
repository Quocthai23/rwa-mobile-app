/**
 * Commission Types
 */

export interface CommissionVolume {
  amount: string
  quantity: string
  symbol: string
}

export interface CommissionDetail {
  email: string
  volumes: CommissionVolume[]
}

export interface CommissionResponse {
  details: CommissionDetail[]
  receiverId: string
  totalAmount: string
}

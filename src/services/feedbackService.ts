import { apiClient } from './ApiClient'

export enum FeedbackType {
  API = 1,
  Deposit = 2,
  Others = 3,
  Events = 4,
  CopyTrading = 5,
  Partnership = 6,
}

export type SubmitFeedbackRequest = {
  feedback: string
  images: string[]
  type: FeedbackType
}

export type FeedbackResponse = {
  feedback: {
    createdAt: string
    feedback: string
    id: string
    images: string[]
    status: number
    type: number
    updatedAt: string
  }
}

export type FeedbackErrorResponse = {
  code: string
  errors: string
  success: false
  t: string
}

export const feedbackApi = {
  submitFeedback: async (
    data: SubmitFeedbackRequest,
  ): Promise<FeedbackResponse> => {
    return apiClient.post<FeedbackResponse>('feedback', data)
  },
}

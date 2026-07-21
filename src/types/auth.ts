export type AuthResponse = LoginResponse

export type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

export type RegisterResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

export type User = {
  avatarUrl: null | string
  createdAt: string
  email: string
  gender: null | string
  id: string
  status: number
  username: string
}

/** Partial update: avatar only, username only, or gender + username */
export type UpdateProfilePayload = {
  avatar?: string
  username?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
}

export type UpdateProfileResponse = {
  success: true
}

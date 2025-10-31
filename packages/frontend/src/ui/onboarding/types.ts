export interface StudentInfo {
  name: string
  age: number
  grade: number
  gender?: string
}

export interface OnboardingState {
  parentalConsent: boolean
  studentInfo: StudentInfo | null
}

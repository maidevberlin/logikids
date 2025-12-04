export interface StudentInfo {
  name: string
  grade: number
}

export interface OnboardingState {
  parentalConsent: boolean
  studentInfo: StudentInfo | null
}

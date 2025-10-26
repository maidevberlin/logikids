import { useState } from 'react'
import { useAuth } from './hooks/useAuth'

/**
 * Test page for zero-knowledge encryption system
 * This demonstrates:
 * - Account creation with end-to-end encryption
 * - Data sync to server (encrypted)
 * - Data retrieval and decryption
 * - Account deletion (GDPR)
 */
export function AuthTestPage() {
  const {
    isAuthenticated,
    isLoading,
    userId,
    error,
    createAccount,
    logout,
    deleteAccount,
    sync,
    getUserData,
    updateUserData,
  } = useAuth()

  const [name, setName] = useState('')
  const [age, setAge] = useState(12)
  const [testProgress, setTestProgress] = useState('')

  const handleCreateAccount = async () => {
    try {
      setTestProgress('Creating account and encrypting data...')
      await createAccount(name, age, 'en')
      setTestProgress('Account created! Data encrypted and uploaded to server.')
    } catch (err) {
      setTestProgress(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleSync = async () => {
    try {
      setTestProgress('Syncing with server...')
      await sync()
      setTestProgress('Sync complete!')
    } catch (err) {
      setTestProgress(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleAddTestProgress = async () => {
    try {
      setTestProgress('Adding test progress and syncing...')
      const data = getUserData()
      await updateUserData({
        progress: {
          ...data.progress,
          math: {
            easy: { correct: 5, wrong: 2, hintsUsed: 3 },
            medium: { correct: 3, wrong: 1, hintsUsed: 1 },
            hard: { correct: 0, wrong: 0, hintsUsed: 0 },
          },
        },
      })
      setTestProgress('Progress added and synced!')
    } catch (err) {
      setTestProgress(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleLogout = async () => {
    try {
      setTestProgress('Logging out...')
      await logout()
      setTestProgress('Logged out!')
    } catch (err) {
      setTestProgress(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to permanently delete your account?')) {
      return
    }

    try {
      setTestProgress('Deleting account from server and local storage...')
      await deleteAccount()
      setTestProgress('Account deleted permanently!')
    } catch (err) {
      setTestProgress(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  if (isLoading) {
    return <div className="p-8">Loading authentication...</div>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Zero-Knowledge Encryption Test</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {testProgress && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          {testProgress}
        </div>
      )}

      {!isAuthenticated ? (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Account (Encrypted)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full border rounded px-3 py-2"
                min="8"
                max="16"
              />
            </div>
            <button
              onClick={handleCreateAccount}
              disabled={!name}
              className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 disabled:bg-gray-300"
            >
              Create Encrypted Account
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p className="font-semibold mb-2">What happens when you create an account:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Generate 256-bit encryption key (client-side)</li>
              <li>Generate random user ID (UUID)</li>
              <li>Create user data with your name and age</li>
              <li>Encrypt data using AES-256-GCM</li>
              <li>Upload encrypted blob to server</li>
              <li>Server CANNOT decrypt your data</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Account Info</h2>
          <div className="space-y-2 mb-6">
            <p><strong>User ID:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-sm">{userId}</code></p>
            <p><strong>Status:</strong> <span className="text-green-600 font-semibold">Authenticated</span></p>
          </div>

          <h3 className="text-lg font-semibold mb-3">Decrypted User Data</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm mb-6">
            {JSON.stringify(getUserData(), null, 2)}
          </pre>

          <div className="space-y-2">
            <button
              onClick={handleSync}
              className="w-full bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              Sync with Server
            </button>
            <button
              onClick={handleAddTestProgress}
              className="w-full bg-green-500 text-white rounded px-4 py-2 hover:bg-green-600"
            >
              Add Test Progress & Sync
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-600"
            >
              Logout (Keep Server Data)
            </button>
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600"
            >
              Delete Account (GDPR)
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p className="font-semibold mb-2">Privacy Guarantees:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>All data encrypted client-side before upload</li>
              <li>Server stores encrypted blobs only</li>
              <li>Server cannot decrypt your data</li>
              <li>Encryption key never leaves your device</li>
              <li>Even admins cannot read your data</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

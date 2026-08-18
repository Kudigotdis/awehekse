import { useState } from 'react'
import { Link } from 'react-router-dom'

const generateCode = () => Math.random().toString(36).substring(2, 8).toUpperCase()

export default function SyncCodeLobby() {
  const [code, setCode] = useState('')
  const [generated, setGenerated] = useState('')
  const [joining, setJoining] = useState(false)

  const createRoom = () => {
    const newCode = generateCode()
    setGenerated(newCode)
  }

  const joinRoom = () => {
    if (code.length >= 4) setJoining(true)
  }

  return (
    <div data-page="Sync_Code_Lobby_Page" aria-label="Sync Code Lobby Page" className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/games" className="text-sm text-tov-green hover:underline">&larr; Back</Link>
      </div>
      <h1 className="text-2xl font-bold text-stone-800">Sync Code Lobby</h1>
      <p className="text-sm text-stone-500">Create or join a room. Works on any device, no internet needed.</p>

      {!generated ? (
        <div className="space-y-4">
          <button onClick={createRoom}
            className="w-full rounded-2xl bg-tov-green p-6 text-left text-white shadow-sm hover:shadow-md">
            <p className="text-lg font-bold">Create Room</p>
            <p className="text-sm text-white/70">Get a code to share with friends</p>
          </button>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="font-medium text-stone-800">Join a Room</h3>
            <div className="mt-3 flex gap-2">
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-center text-lg font-mono tracking-widest focus:border-tov-green focus:outline-none"
                placeholder="ENTER CODE" maxLength={6} />
              <button onClick={joinRoom} disabled={code.length < 4}
                className="rounded-xl bg-tov-green px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                Join
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-tov-green/5 border-2 border-tov-green p-8 text-center">
          <p className="text-sm text-stone-500">Share this code with friends:</p>
          <p className="my-4 text-5xl font-mono font-bold tracking-widest text-tov-green">{generated}</p>
          <p className="text-xs text-stone-400">They can join from the Games section</p>
          <Link to="/games/ckn/multi"
            className="mt-6 block rounded-2xl bg-tov-green py-3 text-sm font-semibold text-white">
            Start Playing
          </Link>
        </div>
      )}

      <p className="text-center text-xs text-stone-400">
        Sync Codes work over local device pairing. No server required.
      </p>
    </div>
  )
}

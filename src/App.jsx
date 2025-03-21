import { useState, useContext, useEffect } from 'react'
import './App.css'
import { ScreenSizeProvider, useScreenSize, SessionProvider, SessionContext, BreakProvider, BreakContext, LockedProvider, IsLockedContext } from './contexts';

function BreakTimer() {
  const { breakx, setBreakx} = useContext(BreakContext)
  return (
    <div className="break-container">
      <h2>break duration</h2>
      <div className="flex can-be-locked">
       <button onClick={() => setBreakx(breakx - 1)} className="minus container-button">
       reduce
      </button>
      <h3>{breakx}</h3>
      <button onClick={() => setBreakx(breakx + 1)} className="plus container-button">
        increment
      </button>
      </div>
    </div>
  )
}

function SessionTimer() {
  const { session, setSession} = useContext(SessionContext)

  return (
    <div className="session-container">
      <h2>session duration</h2>
      <div className="flex can-be-locked">
        <button onClick={() => setSession(session - 1)} className="minus container-button">
          reduce
        </button>
        <h3>{session}</h3>
        <button onClick={() => setSession(session + 1)} className="plus container-button">
          increment
        </button>
      </div>
    </div>
  )
}

function Timer() {
  const {breakx, setBreakx} = useContext(BreakContext);
  const {session, setSession} = useContext(SessionContext);
  const [sessionTime, setSessionTime] = useState(session * 60)
  const [breakTime, setBreakTime] = useState(breakx* 60);
  const [isRunning, setIsRunning] = useState(false)
  
  const getTime = (timeInSeconds) => {
    const timeMinute = Math.floor(timeInSeconds / 60);
    const timeSeconds = timeInSeconds % 60 === 0 ? "00" : timeInSeconds % 60;
    return `${timeMinute}:${("0" + timeSeconds).slice(-2)}`
  }

  const [onDash, setOnDash] = useState(getTime(sessionTime))

  const start = () => {
    setIsRunning(true);
  }

  const pause = () => {
    setIsRunning(false)
  }

  const reset = () => {
    setIsRunning(false);
    setOnDash(getTime(session * 60))
  }

  useEffect(() => {
    if (isRunning) {
      setInterval(() => {
      setSessionTime(sessionTime - 1)
      setOnDash(getTime(sessionTime - 1))
    }, 1000)
    }
      
  }, [isRunning, sessionTime, breakTime, session, breakx])

  return (
    <div className="timer-container">
    <h2>having a <i className="italic">session</i></h2>
    <h2 className="timer-numbers">{onDash}</h2>
    <button onClick={start}>play</button>
    <button onClick={pause}>pause</button>
    <button onClick={reset}>restart</button>
    </div>
  )
}

function Dashboard() {

  const {lock} = useContext(IsLockedContext)
  useEffect(() => {

    if (lock) document.querySelectorAll(".can-be-locked").forEach((div) => {
      div.style.opacity = "0.3"
    })
    else document.querySelectorAll(".can-be-locked").forEach((div) => {
      div.style.opacity = "1"
    })
  }, [])
  const {isMobile} = useScreenSize()
  return (
    <>
    {isMobile ? <div>
      <h1>my 25 + 5 clock</h1>
      <BreakTimer />
      <SessionTimer />
      <Timer />
    </div> :
    <div>
      <h1>my 25 + 5 clock</h1>
      <div className="flex timers-container">
        <BreakTimer />
        <SessionTimer />
      </div>
      <Timer />
    </div>
      }
    </>
  )
}


function App() {
  const [count, setCount] = useState(0)

  return (
    <LockedProvider>
      <BreakProvider>
        <SessionProvider>
          <ScreenSizeProvider>
            <Dashboard />
          </ScreenSizeProvider>
        </SessionProvider>
      </BreakProvider>
    </LockedProvider>
    
  )
}

export default App

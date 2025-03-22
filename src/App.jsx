import { useState, useContext, useEffect } from 'react'
import './App.css'
import { ScreenSizeProvider, useScreenSize, SessionProvider, SessionContext, BreakProvider, BreakContext, LockedProvider, IsLockedContext, ResetContext, ResetProvider } from './contexts';

function BreakTimer() {
  const { breakx, setBreakx} = useContext(BreakContext);
  const {lock} = useContext(IsLockedContext)
  const {didReset} = useContext(ResetContext)

  const handleButton = (value) => {
    if(lock) return;

    switch (value){
      case "-":
        if (breakx <= 1) return
        setBreakx(breakx - 1)
      break;
      case "+":
        if (breakx >= 60) return
        setBreakx(breakx + 1)
      break;  
    }
  }

  useEffect(() => {
    if(didReset){
      setBreakx(5)
    }
  }, [didReset])

  return (
    <div className="break-container">
      <h2 id="break-label">break duration</h2>
      <div className="flex can-be-locked">
       <button id="break-decrement" onClick={() => handleButton("-")} className="minus container-button">
       reduce
      </button>
      <h3 id="break-length">{breakx}</h3>
      <button id="break-increment" onClick={() => handleButton("+")} className="plus container-button">
        increment
      </button>
      </div>
    </div>
  )
}

function SessionTimer() {
  const { session, setSession} = useContext(SessionContext);
  const {lock} = useContext(IsLockedContext);
  const {didReset} = useContext(ResetContext)

  const handleButton = (value) => {
    if (lock) return

    switch (value) {
      case "-":
        if (session <= 1) return
        setSession(session - 1)
      break;
      case "+": 
        if (session >= 60) return
        setSession(session + 1)  
      break;  
    }
  }

  useEffect(() => {
    if(didReset) {
      setSession(25)
    }
  }, [didReset])

  return (
    <div className="session-container">
      <h2 id="session-label">session duration</h2>
      <div className="flex can-be-locked">
        <button id="session-decrement" onClick={() => handleButton("-")} className="minus container-button">
          reduce
        </button>
        <h3 id="session-length">{session}</h3>
        <button id="session-increment" onClick={() => handleButton("+")} className="plus container-button">
          increment
        </button>
      </div>
    </div>
  )
}

function Timer() {
  const {breakx} = useContext(BreakContext);
  const {session} = useContext(SessionContext);
  const {lock, setLock} = useContext(IsLockedContext);
  const {setDidReset} = useContext(ResetContext)

  const [sessionTime, setSessionTime] = useState(session * 60)
  const [breakTime, setBreakTime] = useState(breakx* 60);
  const [breakOrSession, setBreakOrSession] = useState("session")
  
  const getTime = (timeInSeconds) => {
    const timeMinute = Math.floor(timeInSeconds / 60);
    const timeSeconds = timeInSeconds % 60 === 0 ? "00" : timeInSeconds % 60;
    return `${timeMinute}:${("0" + timeSeconds).slice(-2)}`
  }

  const [onDash, setOnDash] = useState(getTime(sessionTime))

  useEffect(() => {
    setSessionTime(session * 60);
    if (breakOrSession === "session") {
      setOnDash(getTime(session * 60))
      document.querySelector(".timer-numbers").style.color = "rgba(255, 255, 255, 0.87)"
    }
  }, [session])

  useEffect(() => {
    setBreakTime(breakx * 60);
    if (breakOrSession === "break") {
      setOnDash(getTime(breakx * 60))
      document.querySelector(".timer-numbers").style.color = "rgba(255, 255, 255, 0.87)"
    }
  }, [breakx])

  const start = () => {
    setLock(true);
    setDidReset(false)
  }

  const pause = () => {
    setLock(false)
    setDidReset(false)
  }

  const reset = () => {
    const audio = document.getElementById("beep")
    audio.pause()
    audio.currentTime = 0;
    setLock(false);
    setSessionTime(session * 60)
    setBreakTime(breakx * 60)
    setOnDash(getTime(session * 60))
    setBreakOrSession("session")
    setDidReset(true)
    setTimeout(() => {
      setDidReset(false)
    }, 50)
    document.querySelector(".timer-numbers").style.color = "rgba(255, 255, 255, 0.87)"
  }


  useEffect(() => {
    let interval;
    if (lock && sessionTime > 0 && breakOrSession === "session") {
      interval = setInterval(() => {
      setSessionTime((prevTime) => {
        const newTime = prevTime - 1;
        setOnDash(getTime(newTime));
        return newTime;
      })
    }, 1000)
    if (sessionTime < 60) {
      document.querySelector(".timer-numbers").style.color = "red"
    }
      return () => clearInterval(interval)
    }
    else if (sessionTime === 0 && breakOrSession === "session") {
      const audio = document.getElementById("beep")
      audio.currentTime = 0;
      audio.play();
      setTimeout(() => {
        setBreakOrSession("break")
        setSessionTime(session * 60)
        setBreakTime(breakx * 60)
        document.querySelector(".timer-numbers").style.color = "rgba(255, 255, 255, 0.87)"
      })
    }

    if (lock && breakTime > 0 && breakOrSession === "break") {
      interval = setInterval(() => {
      setBreakTime((prevTime) => {
        const newTime = prevTime - 1;
        setOnDash(getTime(newTime));
        return newTime;
      })
    }, 1000)
    if (breakTime < 60) {
      document.querySelector(".timer-numbers").style.color = "red"
    }
      return () => clearInterval(interval)
    }
    else if (breakTime === 0 && breakOrSession === "break") {
      const audio = document.getElementById("beep")
      audio.currentTime = 0;
      audio.play();
      setTimeout(() => {
        setBreakOrSession("session")
        setSessionTime(session * 60)
        setBreakTime(breakx * 60)
        document.querySelector(".timer-numbers").style.color = "rgba(255, 255, 255, 0.87)"
      })
    }

  }, [lock, sessionTime, breakTime])


  return (
    <div className="timer-container">
    <h2>having a <i id="timer-label" className="italic">{breakOrSession}</i></h2>
    <h2 id="time-left" className="timer-numbers">{onDash}</h2>
    <button onClick={start}>play</button>
    <button onClick={pause}>pause</button>
    <button id="reset" onClick={reset}>reset</button>
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
  }, [lock])
  const {isMobile} = useScreenSize()
  return (
    <>
    {isMobile ? <div>
      <h1>my 25 + 5 clock</h1>
      <audio id="beep" src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'></audio>
      <BreakTimer />
      <SessionTimer />
      <Timer />
    </div> :
    <div>
      <h1>my 25 + 5 clock</h1>
      <div className="flex timers-container">
        <audio id="beep" src='https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav'></audio>
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

  return (
    <ResetProvider>
      <LockedProvider>
        <BreakProvider>
          <SessionProvider>
            <ScreenSizeProvider>
              <Dashboard />
            </ScreenSizeProvider>
          </SessionProvider>
        </BreakProvider>
      </LockedProvider>
    </ResetProvider>
  )
}

export default App

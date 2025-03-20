import { useState } from 'react'
import './App.css'
import { ScreenSizeProvider, useScreenSize } from './contexts';

function BreakTimer() {
  return (
    <div className="break-container">
      <h2>break duration</h2>
      <div className="flex">
       <button className="minus container-button">
       reduce
      </button>
      <h3>5 minutes</h3>
      <button className="plus container-button">
        increment
      </button>
      </div>
    </div>
  )
}

function SessionTimer() {
  return (
    <div className="session-container">
      <h2>session duration</h2>
      <div className="flex">
        <button className="minus container-button">
          reduce
        </button>
        <h3>5 minutes</h3>
        <button className="plus container-button">
          increment
        </button>
      </div>
    </div>
  )
}

function Timer() {
  return (
    <div className="timer-container">
    <h2>having a <i className="italic">session</i></h2>
    <h2>25:00</h2>
    <button>play</button>
    <button>pause</button>
    <button>restart</button>
    </div>
  )
}

function Dashboard() {
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
    <ScreenSizeProvider>
      <Dashboard />
    </ScreenSizeProvider>
  )
}

export default App

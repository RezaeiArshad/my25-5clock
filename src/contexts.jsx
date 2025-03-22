import React, { createContext, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const ScreenSizeContext = createContext();

export const useScreenSize = () => useContext(ScreenSizeContext);

export const ScreenSizeProvider = ({ children }) => {
    const isMobile = useMediaQuery({ maxWidth: 800});

    return (
        <ScreenSizeContext.Provider value={{isMobile}}>
            {children}
        </ScreenSizeContext.Provider>
    )
}

export const SessionContext = createContext({
    session: 25,
    setSession: () => {}
});

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(25)
    return (
        <SessionContext.Provider value={{ session, setSession}}>
            {children}
        </SessionContext.Provider>
    )
}

export const BreakContext = createContext({
    breakx: 5,
    setBreak: () => {}
});


export const BreakProvider = ({ children }) => {
    const [breakx, setBreakx] = useState(5)
    return (
        <BreakContext.Provider value={{ breakx, setBreakx}}>
            {children}
        </BreakContext.Provider>
    )
}

// islocked means the timer is ticking

export const IsLockedContext = createContext({
    isLocked: false
})

export const LockedProvider = ({ children }) => {
    const [lock, setLock] = useState(false);
    return (
        <IsLockedContext.Provider value={{ lock, setLock }}>
            {children}
        </IsLockedContext.Provider>
    )
}

export const ResetContext = createContext({
    reset: false
})

export const ResetProvider = ({ children }) => {
    const [didReset, setDidReset] = useState(false);

    return (
        <ResetContext.Provider value={{ didReset, setDidReset}}>
            {children}
        </ResetContext.Provider>
    )
}
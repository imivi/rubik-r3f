import { useCallback, useEffect } from "react"



type KeypressCallback = (key: KeyboardEvent["key"], shift: boolean) => void


export function useKeypress(onKeypress: KeypressCallback) {

    const handleKeypress = useCallback((e: KeyboardEvent) => {
        const shiftActive = e.getModifierState("Shift")
        onKeypress(e.key.toUpperCase(), shiftActive)
    }, [onKeypress])
    
    useEffect(() => {
        window.addEventListener("keydown", handleKeypress)
        
        return () => {
            window.removeEventListener("keydown", handleKeypress)
        }
    })
}
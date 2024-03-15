import { useRef, useEffect } from "react";
import { useSelector } from "react-redux";

const Board = () => {
    const canvasRef = useRef(null);
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)
    const {color, size} = useSelector((state) => state.toolbox[activeMenuItem])
    const shouldDraw = useRef(false)

    // updating configs
    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        const changeConfig = (color, size) => {
            context.strokeStyle = color
            context.lineWidth = size
        }
        changeConfig(color, size)

        
    }, [color, size])

    // mounting
    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const handleMouseDown = (e) => {
            shouldDraw.current = true
            context.beginPath()
            context.moveTo(e.clientX, e.clientY)
        }

        const handleMouseMove = (e) => {
            if (!shouldDraw.current) return
            context.lineTo(e.clientX, e.clientY)
            context.stroke()
        }

        const handleMouseUp = (e) => {
            shouldDraw.current = false
        }


        canvas.addEventListener('mousedown', handleMouseDown)
        canvas.addEventListener('mousemove', handleMouseMove)
        canvas.addEventListener('mouseup', handleMouseUp)

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseup', handleMouseUp)
        }

    }, [])


    return(
        <canvas ref={canvasRef}></canvas>
    )
}

export default Board;
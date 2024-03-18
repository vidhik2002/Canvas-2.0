import { useRef, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MENU_ITEMS } from "@/constants";
import { actionItemClick } from '@/slice/menuSlice'

const Board = () => {
    const canvasRef = useRef(null);
    const {activeMenuItem, actionMenuItem} = useSelector((state) => state.menu)
    const {color, size} = useSelector((state) => state.toolbox[activeMenuItem])
    const shouldDraw = useRef(false)
    const drawHistory = useRef([])
    const historyPointer = useRef(0)
    const dispatch = useDispatch()

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const URL = canvas.toDataURL()
            const anchor = document.createElement('a')
            anchor.href = URL
            anchor.download = 'sketch.jpg'
            anchor.click()
        }else if (actionMenuItem === MENU_ITEMS.CANCEL) {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight

            context.fillStyle = 'white';
            context.fillRect(0, 0, canvas.width, canvas.height);
        }else if (actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO) {
            if (actionMenuItem === MENU_ITEMS.UNDO && historyPointer.current === 0) {
                // If only one item left to undo, reset canvas to initial state
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                context.fillStyle = 'white';
                context.strokeStyle = color;
                context.lineWidth = size;
                context.fillRect(0, 0, canvas.width, canvas.height);

                dispatch(actionItemClick(null));
                return; // Return early to avoid further drawing operations
            }
            let newPointer = historyPointer.current;
            if (actionMenuItem === MENU_ITEMS.UNDO && newPointer > 0) {
                newPointer -= 1;
            } else if (actionMenuItem === MENU_ITEMS.REDO && newPointer < drawHistory.current.length - 1) {
                newPointer += 1;
            }
            if (newPointer !== historyPointer.current) {
                const imageData = drawHistory.current[newPointer];
                context.putImageData(imageData, 0, 0);
                historyPointer.current = newPointer;
            }
        }
        dispatch(actionItemClick(null))
    }, [actionMenuItem, dispatch])

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
    useLayoutEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const beginPath = (x, y) => {
            context.beginPath()
            context.moveTo(x, y)
        }

        const drawLine = (x, y) => {
            context.lineTo(x, y)
            context.stroke()
        }
        const handleMouseDown = (e) => {
            shouldDraw.current = true
            beginPath(e.clientX, e.clientY)
        }

        const handleMouseMove = (e) => {
            if (!shouldDraw.current) return
            drawLine(e.clientX, e.clientY)
            
        }

        const handleMouseUp = (e) => {
            shouldDraw.current = false
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
            drawHistory.current.push(imageData)
            historyPointer.current = drawHistory.current.length - 1
            console.log(historyPointer.current)
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
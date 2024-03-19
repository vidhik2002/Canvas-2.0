import { useRef, useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MENU_ITEMS } from "@/constants";
import { actionItemClick } from '@/slice/menuSlice'
// import { SketchPicker } from 'react-color'

const Board = () => {
    const canvasRef = useRef(null);
    const {activeMenuItem, actionMenuItem} = useSelector((state) => state.menu)
    const {color, size, opacity} = useSelector((state) => state.toolbox[activeMenuItem])
    const shouldDraw = useRef(false)
    const drawHistory = useRef([])
    const historyPointer = useRef(0)
    const dispatch = useDispatch()


    const handleImportImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
    
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
    
            // Resize canvas to fit image
            canvas.width = img.width;
            canvas.height = img.height;
    
            // Draw imported image on canvas
            context.drawImage(img, 0, 0);
    
            // Save image data to draw history
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            drawHistory.current.push(imageData);
            historyPointer.current = drawHistory.current.length - 1;
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleColorChange = () => {
        const input = document.createElement('input');
        input.type = 'color';

        // Adjust the position to move the color picker to the right side of the screen
        input.style.position = 'fixed';
        input.style.top = '50%'; // Center vertically
        input.style.right = '10%'; // Move the color picker to the right side of the screen
        input.style.transform = 'translate(-50%, -50%)';

        // Correct the typo in the display property
        input.style.display = 'absolute';
        
        // Add event listener to handle color change
        input.addEventListener('input', () => {
            const selectedColor = input.value;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.fillStyle = selectedColor; // Set the fill style to the selected color
            context.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the selected color
        });

        input.click();
        // input.addEventListener('change', () => {
        //     document.body.removeChild(input); // Remove the color picker from the body
        // });

        // Append the input element to the body and trigger its click event
        // document.body.appendChild(input);
        
    };

    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const fileName = prompt("Enter the file name:", "sketch"); // Prompt for filename
            if (fileName === null) { // If user cancels, do nothing
                dispatch(actionItemClick(null));
                return;
            }
            const URL = canvas.toDataURL()
            const anchor = document.createElement('a')
            anchor.href = URL
            anchor.download = fileName.trim() || 'sketch';
            // anchor.download = 'sketch.jpg'
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
        }else if (actionMenuItem === MENU_ITEMS.IMPORT) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = handleImportImage;
            input.click();
        }else if (actionMenuItem === MENU_ITEMS.PAINT) {
            handleColorChange()
        }
        dispatch(actionItemClick(null))
    }, [actionMenuItem, dispatch])

    // updating configs
    useEffect(() => {
        if (!canvasRef.current) return
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d')

        const changeConfig = (color, size, opacity) => {
            context.strokeStyle = color
            context.lineWidth = size
            context.globalAlpha = opacity
        }
        changeConfig(color, size, opacity)

        
    }, [color, size, opacity])

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
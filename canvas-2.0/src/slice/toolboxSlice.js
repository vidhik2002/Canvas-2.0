import { createSlice } from "@reduxjs/toolkit"
import { COLORS, MENU_ITEMS } from "@/constants"

const initialState = {
    [MENU_ITEMS.PENCIL]: {
        color: COLORS.BLACK,
        size: 15,
        opacity: 1
    },
    [MENU_ITEMS.ERASER]: {
        color: COLORS.WHITE,
        size: 20,
        opacity: 1
    },
    [MENU_ITEMS.UNDO]: {},
    [MENU_ITEMS.REDO]: {},
    [MENU_ITEMS.DOWNLOAD]: {},

}

export const toolboxSlice = createSlice({
    name: 'toolbox',
    initialState,
    reducers: {
        changeColor: (state, action) => {
            state[action.payload.item].color = action.payload.color
        },
        changeBrushSize: (state, action) => {
            state[action.payload.item].size = action.payload.size
        },
        changeOpacity: (state, action) => {
            state[action.payload.item].opacity = action.payload.opacity;
        },
    }
})

export const { changeColor, changeBrushSize, changeOpacity } = toolboxSlice.actions
export default toolboxSlice.reducer
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css'
import cx from 'classnames';
import { COLORS, MENU_ITEMS } from '@/constants'
import { changeBrushSize, changeColor } from '@/slice/toolboxSlice'

const Toolbox = () => {
    const activeMenuItem = useSelector((state) => state.menu.activeMenuItem)
    const showStrokeTool = activeMenuItem === MENU_ITEMS.PENCIL
    const showBrushTool = activeMenuItem === MENU_ITEMS.PENCIL || MENU_ITEMS.ERASER
    const dispatch = useDispatch()
    const {color, size} = useSelector((state) => state.toolbox[activeMenuItem])

    const updateBrushSize = (e) => {
        dispatch(changeBrushSize({item: activeMenuItem, size: e.target.value}))
    }
    const updateColor = (newcolor) => {
        dispatch(changeColor({item: activeMenuItem, color: newcolor}))
    }
    return (
        <div className={styles.toolboxContainer}>
            { showStrokeTool && <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Stroke color</h4>
                <div className={styles.itemContainer}>
                   <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.BLACK})} style={{backgroundColor: COLORS.BLACK}} onClick={() => updateColor(COLORS.BLACK)}/>
                   <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.RED})} style={{backgroundColor: COLORS.RED}} onClick={() => updateColor(COLORS.RED)}/>
                   <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.GREEN})} style={{backgroundColor: COLORS.GREEN}} onClick={() => updateColor(COLORS.GREEN)}/>
                   <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.BLUE})} style={{backgroundColor: COLORS.BLUE}} onClick={() => updateColor(COLORS.BLUE)}/>
                   <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.ORANGE})} style={{backgroundColor: COLORS.ORANGE}} onClick={() => updateColor(COLORS.ORANGE)}/> 
                   <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.YELLOW})} style={{backgroundColor: COLORS.YELLOW}} onClick={() => updateColor(COLORS.YELLOW)}/>
                   <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.WHITE})} style={{backgroundColor: COLORS.WHITE}} onClick={() => updateColor(COLORS.WHITE)}/>
                   <div className={cx(styles.colorBox, {[styles.active]: color === COLORS.VIOLET})} style={{backgroundColor: COLORS.VIOLET}} onClick={() => updateColor(COLORS.VIOLET)}/>
                </div>
            </div>}
            {showBrushTool && <div className={styles.toolItem}>
                <h4 className={styles.toolText}>Brush Size</h4>
                <div className={styles.itemContainer}>
                <input type="range" min={1} max={10} step={1} onChange={updateBrushSize}/>
                </div>
            </div>}
            
        </div>
    )
}

export default Toolbox;
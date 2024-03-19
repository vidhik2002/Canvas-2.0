import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faEraser, faRotateLeft, faRotateRight, faFileArrowDown, faR, faSackXmark, faXmark, faCloudDownload, faUpload, faPaintRoller } from '@fortawesome/free-solid-svg-icons'
import styles from './index.module.css'
import { MENU_ITEMS } from '@/constants'
import cx from 'classnames'
import { menuItemClick, actionItemClick } from '@/slice/menuSlice'
import { useDispatch, useSelector } from 'react-redux' 

const Menu = () => {
    const dispatch = useDispatch()
    const activeMenuItem =  useSelector((state) => state.menu.activeMenuItem)
    const handleMenuClick = (itemName) => {
        dispatch(menuItemClick(itemName))
    }
    const handleActionItemClick = (itemName) => {
        dispatch(actionItemClick(itemName))
    }

    return(
        <div className={styles.menuContainer}> 
            <div className={cx(styles.iconWrapper, {[styles.active]: activeMenuItem === MENU_ITEMS.PENCIL})} onClick={() =>handleMenuClick(MENU_ITEMS.PENCIL)} > 
                <FontAwesomeIcon icon={faPencil} className={styles.icon} />
            </div>
            <div className={cx(styles.iconWrapper, {[styles.active]: activeMenuItem === MENU_ITEMS.ERASER})} onClick={() =>handleMenuClick(MENU_ITEMS.ERASER)}> 
                <FontAwesomeIcon icon={faEraser} className={styles.icon} />
            </div>
            <div className={styles.iconWrapper} onClick={() =>handleActionItemClick(MENU_ITEMS.UNDO)}> 
                <FontAwesomeIcon icon={faRotateLeft} className={styles.icon}/>
            </div>
            <div className={styles.iconWrapper} onClick={() =>handleActionItemClick(MENU_ITEMS.REDO)}> 
                <FontAwesomeIcon icon={faRotateRight} className={styles.icon}/>
            </div>
            <div className={styles.iconWrapper} onClick={() =>handleActionItemClick(MENU_ITEMS.DOWNLOAD)}> 
                <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon}/>
            </div>
            <div className={styles.iconWrapper} onClick={() =>handleActionItemClick(MENU_ITEMS.IMPORT)}> 
                <FontAwesomeIcon icon={faUpload} className={styles.icon}/>
            </div>
            <div className={styles.iconWrapper} onClick={() =>handleActionItemClick(MENU_ITEMS.PAINT)}> 
                <FontAwesomeIcon icon={faPaintRoller} className={styles.icon}/>
            </div>
            <div className={styles.iconWrapper} onClick={() =>handleActionItemClick(MENU_ITEMS.CANCEL)}> 
                <FontAwesomeIcon icon={faXmark} className={styles.icon}/>
            </div>
            
        </div>
    )
}

export default Menu;
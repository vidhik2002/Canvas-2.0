import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faEraser, faRotateLeft, faRotateRight, faFileArrowDown, faR } from '@fortawesome/free-solid-svg-icons'
import styles from './index.module.css'
import { MENU_ITEMS } from '@/constants'
import { menuItemClick, actionItemClick } from '@/slice/menuSlice'
import { useDispatch } from 'react-redux' 

const Menu = () => {
    const dispatch = useDispatch()
    const handleMenuClick = (itemName) => {
        dispatch(menuItemClick(itemName))
    }
    return(
        <div className={styles.menuContainer}> 
            <div className={styles.iconWrapper}> 
                <FontAwesomeIcon icon={faPencil} className={styles.icon} onClick={() =>handleMenuClick(MENU_ITEMS.PENCIL)} />
            </div>
            <div className={styles.iconWrapper}> 
                <FontAwesomeIcon icon={faEraser} className={styles.icon} onClick={() =>handleMenuClick(MENU_ITEMS.ERASER)}/>
            </div>
            <div className={styles.iconWrapper}> 
                <FontAwesomeIcon icon={faRotateLeft} className={styles.icon}/>
            </div>
            <div className={styles.iconWrapper}> 
                <FontAwesomeIcon icon={faRotateRight} className={styles.icon}/>
            </div>
            <div className={styles.iconWrapper}> 
                <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon}/>
            </div>
        </div>
    )
}

export default Menu;
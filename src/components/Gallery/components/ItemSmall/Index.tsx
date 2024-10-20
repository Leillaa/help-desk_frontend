import { styles } from "./styles"

const ItemSmall = ({...props})=> {

    const {
        customTheme,
        image,
        setActiveItem,
        index
    } = props

    const classes = styles(customTheme)


    return (
        <>
            <div    
                onClick={()=>setActiveItem(index)}
                className={classes.image} 
                style={{backgroundImage: 'url(' + image.image + ')'}}></div>
        </>
    )
}


    
    export default ItemSmall
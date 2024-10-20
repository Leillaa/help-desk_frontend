import { useEffect, useLayoutEffect, useState } from "react"
import { styles } from "./styles"
import { IComment } from "../../../../lib/types/interfaces";
import Gallery from "../../../../components/Gallery";
import DatePrinter from "../../../../components/DatePrinter";
import ButtonRounded from "../../../../components/ButtonRounded/ButtonRounded";
import ButtonRectangle from "../../../../components/ButtonRectangle/ButtonRectangle";
import ModalWindow from "../../../../components/ModalWindow";

import * as RequestController from '../../../../http/controllers/RequestController'



const RightInfo = ({...props})=>{
    const {
        customTheme,
        colorClass,
        request,
        commentCount
    } = props
    const classes = styles(customTheme)
    const [isActive, setIsActive] = useState<boolean>(false)
    const [notice, setNotice] = useState<any>()
    const buttonStyles = {
        width: '100%',
    }

    useLayoutEffect(()=>{
        setIsActive(request.status == 'Active')
    }, [])

    const onCloseRequest = ()=>{
        let modal = <ModalWindow
                        title='Предупреждение' 
                        content='Вы уверены, что хотите закрыть заявку?'
                        type=''
                        isClose={true}
                        onClose={()=>setNotice(<></>)}
                        action={closeRequest}
                        actionName='Закрыть заявку'
                        customTheme={customTheme}  
                    />
        setNotice(modal)
    }
    const closeRequest = () => {
       alert('Отправка запроса на сервер')
        RequestController.closeRequest(request.id).then(()=>{
            let modal = <ModalWindow
                      title='Ура!'
                      content='Заявка была закрыта'
                      type='ok'
                      isClose={true}
                      onClose={()=>setNotice(<></>)}
                      customTheme={customTheme}
                   />
            setNotice(modal)
        })

    }

    return (
        <>
            { notice }
            <div className={classes.aboutRequest.concat(' ').concat(colorClass || '')}>
                <div className={classes.aboutRequestDiv}>
                    <div className={classes.aboutRequestDivDiv}>От кого:</div>
                    {request.name}
                </div>
                <div className={classes.aboutRequestDiv}>
                    <div className={classes.aboutRequestDivDiv}>Открыта:</div>
                    <DatePrinter date={new Date(request.created as string)} format='dd.mm.yy HH:MM:SS' />
                </div>
                <div className={classes.aboutRequestDiv}>
                    <div className={classes.aboutRequestDivDiv}>Статус:</div>
                    {request.status}
                </div>
                <div className={classes.aboutRequestDiv}>
                    <div className={classes.aboutRequestDivDiv}>Комментарии:</div>
                    {commentCount} 
                </div>
                {request.status}
                {
                    (isActive) ? <>
                        <div>
                            <ButtonRectangle onClick={onCloseRequest} value='Закрыть заявку' style={buttonStyles} />
                        </div>
                    </>
                    : <></>
                }

            </div>
        </>
    )
}

export default RightInfo
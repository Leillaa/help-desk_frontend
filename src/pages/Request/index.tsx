import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { styles } from "./styles";
import { useContext, useEffect, useState } from "react";
import DatePrinter from "../../components/DatePrinter";
import FormComment from "./components/FormComment";
import CommentList from "./components/CommentList";
import Header from "../../components/Header";
import { CATEGORIES_REQ, IComment, IRequest, IRequestAttechment } from "../../lib/types/interfaces";

import * as RequestController from '../../http/controllers/RequestController'
import Gallery from "../../components/Gallery";
import { PATHS } from "../../lib/constants/routes";
import { UserContext } from "../..";
import ModalWindow from "../../components/ModalWindow";
import RightInfo from "./components/RightInfo";



const Request = ({...props}) => {
    const [outletContext] = useOutletContext() as Array<any>;

    const {
        customTheme
    } = outletContext
    const classes = styles(customTheme)
    const { id } = useParams(); 
    const navigate = useNavigate();
    const user = useContext(UserContext)

    const [request, setRequest] = useState<IRequest>({})
    const [commentList, setCommentList] = useState<Array<IComment>>([])
    const [attachments, setAttachments] = useState<Array<IRequestAttechment>>([])
    const [isRerender, setIsRerender] = useState<boolean>(false)
    const [notice, setNotice] = useState<any>()
    
    // Массив для окараски страницы в соответствующие стили в зависимости от пердаваемого значения
    const priorities = ['noUrgently', 'done', 'urgently']
    const priorityTypes: any = {}
    priorities.forEach(function(el, i) {
        priorityTypes[(CATEGORIES_REQ[i as never] as any).type] = el
    });

    let colorClass =  classes[priorityTypes[request.groups as string] as never]

    useEffect(()=>{
        //Запрос к БД
        if (id)
            RequestController.getOneById(parseInt(id as string)).then((resp :any)=>{
                if (resp?.application) setRequest(resp?.application);
                if (resp?.attachment) setAttachments(resp?.attachment)

                let newFormatComment = resp?.comment.map((comment :any) => {return {comment: comment}})
                let attechmentcomment = [...newFormatComment, ...resp?.attachment_comment]
                    .map((comment : IComment) => {
                        comment.comment!.created = new Date(comment.comment?.created as string)
                        return comment
                    }).sort((a:IComment, b:IComment)=> ((a.comment?.created as Date ) > (b.comment?.created as Date)) ? 1 : -1)
                if (attechmentcomment) setCommentList(attechmentcomment)

                colorClass =  classes[priorityTypes[request.groups as string] as never]
            }).catch((e :any)=>{
                console.log('ERROR: ', e, '--Ошибка загрузки тела запроса')
                if (e.response?.status == 403) {
                    let modal = <ModalWindow
                                    title='Ошибка' 
                                    content='Ошибка авторизации'
                                    type='error'
                                    // isClose={true}
                                    onClose={()=>{
                                        user?.logout()
                                        navigate(PATHS.LOGIN)
                                        // setNotice(<></>)
                                    }}
                                    customTheme={customTheme}  
                                />
                    setNotice(modal)
                    // alert('Ошибка авторизации')
                    
                } else if (e.response?.status == 500) {
                    let modal = <ModalWindow
                                    title='Ошибка' 
                                    content='Простите, данное действие временно не доступно'
                                    type='error'
                                    isClose={true}
                                    onClose={()=>setNotice(<></>)}
                                    customTheme={customTheme}  
                                />
                    setNotice(modal)
                    // alert('Простите, данное действие временно не доступно')
                } else {
                    let modal = <ModalWindow
                                    title='Ошибка' 
                                    content='Непредвиденная ошибка, данные могут отображаться частично. Пожалуйста, сообщите об этом в поддержку'
                                    type='error'
                                    isClose={true}
                                    onClose={()=>setNotice(<></>)}
                                    customTheme={customTheme}  
                                />
                    setNotice(modal)
                    // alert('Непредвиденная ошибка, данные могут отображаться частично. Пожалуйста, сообщите об этом в поддержку')
                    console.log('ERROR: несоответствие форматов данных сервера и клиента')
                }
            })
        else console.log('вопрос не найден')
    }, [])

    
    useEffect(()=>{
        if (id){
            RequestController.getOneById(parseInt(id as string)).then((resp :any)=>{
                if (resp?.application) setRequest(resp?.application);
                if (resp?.attachment) setAttachments(resp?.attachment)

                let newFormatComment = resp?.comment.map((comment :any) => {return {comment: comment}})
                let attechmentcomment = [...newFormatComment, ...resp?.attachment_comment]
                    .map((comment : IComment) => {
                        comment.comment!.created = new Date(comment.comment?.created as string)
                        return comment
                    }).sort((a:IComment, b:IComment)=> ((a.comment?.created as Date ) > (b.comment?.created as Date)) ? -1 : 1)
                if (attechmentcomment) setCommentList(attechmentcomment)

                colorClass =  classes[priorityTypes[request.groups as string] as never]


            }).catch((e :any)=>{
                console.log('ERROR: ', e, '--Ошибка загрузки тела запроса')

                if (e.response?.status == 403) {
                    
                    alert('Ошибка авторизации')
                    user?.logout()
                    navigate(PATHS.LOGIN)
                } else if (e.response?.status == 500) {
                    alert('Простите, данное действие временно не доступно')
                } else {
                    alert('Непредвиденная ошибка, данные могут отображаться частично. Пожалуйста, сообщите об этом в поддержку')
                    console.log('ERROR: несоответствие форматов данных сервера и клиента')
                }
            })}
        else console.log('вопрос не найден')
    }, [isRerender])


    return (<> 
        {(request.id) ? <>
            {notice}
            <Header customTheme={customTheme} />
            <div className={classes.page} >
                <div className={classes.content}> 
                    <h2>Заявка №{request.id}</h2>
                    <div className="">
                        <h4 className={classes.h4}>Тема:</h4>
                        <p className={classes.p.concat(' ').concat(colorClass || '')}>{(request.team) ? request.team : ''}</p>
                    </div>
                    
                    <div className="">
                        <h4 className={classes.h4}>Проблема:</h4>
                        <p className={classes.p.concat(' ').concat(colorClass || '')}>{(request.text)  ? request.text : ''}</p>
                    </div>
                    <div className="">
                        <Gallery listGallery={attachments} customTheme={customTheme}/>
                    </div>

                    <h4 className="mt-5 mb-5">Комментарии:</h4>
                    
                    <FormComment idRequest={id} isRerender={isRerender} setIsRerender={setIsRerender} customTheme={customTheme}/>

                    <CommentList 
                        commentList={commentList} 
                        colorClass={colorClass}/>
                    
                </div>
                <RightInfo
                    customTheme = {customTheme}
                    colorClass = {colorClass}
                    request = {request}
                    commentCount = {commentList.length}
                />

            </div>
        </> : <></>}
    </>)
}

export default Request
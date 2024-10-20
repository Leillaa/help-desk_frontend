import { useNavigate, useOutletContext } from "react-router-dom";
import { styles } from "./styles";
import { createRef, useContext, useRef, useState } from "react";
import InputText from "../../components/Form/InputText";
import Textarea from "../../components/Form/Textarea";
import InputFile from "../../components/Form/InputFile/Index";
import ButtonRounded from "../../components/ButtonRounded/ButtonRounded";
import { Field, Form } from "react-final-form";

import * as RequestController from '../../http/controllers/RequestController'
import Validator from "../../lib/utils/validator";
import Header from "../../components/Header";
import { IRequest } from "../../lib/types/interfaces";
import { UserContext } from "../..";
import { PATHS } from "../../lib/constants/routes";
import ModalWindow from "../../components/ModalWindow";

type INewRequest = {
    subject: string,
    description: string,
    files: any
}

const NewRequest = ({...props}) => {
    const [enterType, setEnterType] = useState(true);
    const [outletContext] = useOutletContext() as Array<any>;
    const user = useContext(UserContext)

    const {
        customTheme
    } = outletContext
    const classes = styles(customTheme)
    const navigate = useNavigate();
    const validator = new Validator();

    const thisForm = useRef<HTMLFormElement>(null);

    const [notice, setNotice] = useState<any>()

    const onsubmit = (values: IRequest | INewRequest | any) :void =>{
         
        const formData = new FormData(thisForm.current as HTMLFormElement )
        formData.append('id', String( user?.getUserID) )
        
        RequestController.createOne(formData).then((resp : any) => {
            console.log(resp);
            // Получить айди пользователя из ответа

            navigate(PATHS.REQUEST + resp[0].id)
        }).catch( (e: any) => {
            console.log('ERROR:', e.message, '--Ошибка отправки запроса')
            if (e.response.status == 403) { 
                let modal = <ModalWindow
                            title='Ошибка' 
                            content='Ошибка авторизации'
                            type='error'
                            isClose={true}
                            onClose={()=>{
                                user?.logout()
                                navigate(PATHS.LOGIN)
                                // setNotice(<></>)
                            }}
                            customTheme={customTheme}  
                        />
                setNotice(modal)
                // alert('Ошибка авторизации')
                               
                
            }
            if (e.response.status == 500) {
                let modal = <ModalWindow
                            title='Ошибка' 
                            content='Простите, данное действие временно не доступно'
                            type='error'
                            isClose={true}
                            onClose={()=>setNotice(<></>)}
                            customTheme={customTheme}  
                        />
                setNotice(modal)
            }
        })
    }

    const validate = (values :any)=>{
        const errors : {
            subject?: string,
            description?: string,
            files?:string
        } = {}
        console.log(values)
        if (!values.subject ) {
            errors.subject = 'тема заявки не может быть пустой' 
        } 
        
        if (!values.description ) {
            errors.description = 'текст заявки не может быть пустым'
        } else if (values.description.length > 750) {
            errors.description = 'текст заявки слишком длинный (ограничение: 750 символов)'

        }

        if (values.files ) {
            console.log(values.attachments)
            let re = /(\.jpg|\.jpeg|\.bmp|\.svg|\.png)$/i;
            if (!re.exec(values.files)) {
                errors.files = 'расширение файла не поддерживается (только изображения)' 
            }
        }


        return errors
    }


    return (
        <div>
            <Header customTheme={customTheme} />
            {notice}
            <div className={classes.page}>
            <Form
                onSubmit={(e)=>onsubmit(e as React.FormEvent)}
                validate={(values) => validate(values)}
                render={({ handleSubmit }) => (
                    <form ref={thisForm} onSubmit={handleSubmit} className={classes.form}> 
                        <h1 className={''}>Новая заявка:</h1>
                        <Field name="subject">
                            {({ input, meta }) => (
                                <div className={classes.formDiv}>
                                    <label className={classes.formLabel}>Тема:</label>
                                    <div>
                                        <InputText {...input} customTheme={customTheme} small={true}/>    
                                        {meta.error && meta.touched && <span className={classes.exceptText}>{meta.error}</span>}
                                    </div>
                                </div>
                            )}
                        </Field>
                        
                        <Field name="description">
                            {({ input, meta }) => (
                                <div className={classes.formDiv}>
                                    <label  className={classes.formLabel}>Опишите проблему:</label>
                                    <div>
                                        <Textarea {...input} customTheme={customTheme}  style={{minHeight: '200px'}}/> 
                                        {meta.error && meta.touched && <span className={classes.exceptText}>{meta.error}</span>}
                                    </div>
                                </div>
                            )}
                        </Field>
                        
                        <Field name="files">
                            {({ input, meta }) => (
                                <div className={classes.formDiv}>
                                    <InputFile {...input} customTheme={customTheme} />
                                    {meta.error && meta.touched && <span className={classes.exceptText}>{meta.error}</span>}
                                </div>
                            )}
                        </Field>

                        <div  className={classes.formDiv}>
                            <ButtonRounded type='submit' value="отправить" customTheme={customTheme} style={{width: '100%'}}/>
                        </div>
                        
                    </form>
                )}
            />
                <div className={classes.image}></div>

            </div>
        </div>
    )
}

export default NewRequest
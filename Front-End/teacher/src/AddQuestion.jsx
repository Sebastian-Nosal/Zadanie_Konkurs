import {React, useEffect, useState, useContext} from 'react';
import {Token} from './App'
import axios from 'axios'
import AddIcon from '@mui/icons-material/Add';
import { useForm } from "react-hook-form";

const AddQuestion = props =>
{
    const [tag, setTag] = useState('');
    const [questions, setQuestions] = useState([])
    const {token} = useContext(Token);
    const { register, handleSubmit } = useForm();
    const [file,setFile] = useState(undefined);
    const [checked,setChecked] = useState(true)
    //console.log(props)

    const getQuestions = () =>
    {
        if(tag!==''&&tag!=='undefined') {
            const result = axios.get('/api/questions/?tag='+tag, {headers:{
                'x-access-token': token,
            }});
            result.catch(err=> console.log(err.data))
            result.then(response=>{console.log(response); setQuestions(response.data)}) 
        }
        console.log('empty tag'+ tag)
        
    }

    const handleFile = (ev) =>
    {
        const f = ev.target.files[0];
        console.log(f)
        setFile(file);
    }

    const addQuestion = (data) =>
    {
        //console.log(data);
        const formData = new FormData()
        formData.append('content',data.content);
        formData.append('correct',data.correct);
        if(data.image) 
            {
                console.log(data.image)
                formData.append('image',data.image.item(0));
            }
        formData.append('isPublic',checked)
        let tags = data.tags.split(',');
        tags = tags.map(el=>{if(el!==undefined) return el.trim()});
        
        tags.forEach(el=> formData.append('tags',el))
        console.log(formData)
        
        axios.post('/api/questions/', formData, {
                headers: {
                    'x-access-token': token
                }
        }).then(()=>document.getElementsByName("content").value="",err=>console.log(err))
    }

    return(
            <div className='Container__App Container__App__Questions'>
                <h2>Lista Pytań</h2>
                <div>
                    <input type='text' onChange={event =>setTag(event.target.value)}/>
                    <button onClick={getQuestions}>Wyszukaj</button>
                </div>
                <div className='Questions-List'>
                    <ul>
                        {
                            questions.map(el=>{
                                return (<li key={el._id}><span>{el.content}</span><button onClick={()=>props.setList(JSON.stringify({id: el._id, content: el.content}))}><AddIcon/></button></li>)
                            })
                        }
                    </ul>
                </div>
                <form onSubmit={handleSubmit(addQuestion)}>
                    <textarea placeholder={`Podaj treść pytania i odpowiedzi. \nWzór: Treść\nA. Odpowiedź\nB. Odpowiedź...`} {...register('content', { required: true, minLength: 1})} /> 
                    <select {...register('correct')}>
                        <option value='A'>A</option>
                        <option value='B'>B</option>
                        <option value='C'>C</option>
                        <option value='D'>D</option>
                    </select>
                    <textarea placeholder='Podaj tagi pytania oddzielone przecinkami'{...register('tags', { required: true, minLength: 1})} /> 
                    <div>
                        <input type="file" onChange={(ev)=>handleFile(ev)} {...register('image')}  accept=".jpg,.jpeg,.png,.svg"/>
                        <label><input type="checkbox" {...register('isPublic')} checked={checked} onChange={(()=>setChecked(!checked))}/>Publiczne</label>
                    </div>
                    <input type='submit' value='Dodaj Pytanie'/>
                </form>
            </div>
        )
        
}

export default AddQuestion;
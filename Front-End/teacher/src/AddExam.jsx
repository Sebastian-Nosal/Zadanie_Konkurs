import {React, useEffect, useState, useContext} from 'react';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {Token} from './App';
import {useForm} from 'react-hook-form'
import axios from 'axios'

const AddExam = props =>
{
    const [questions, setQuestions] = useState([]);
    const {token, groupList, copiedExam} = useContext(Token);
    const {register, handleSubmit} = useForm();

    useEffect(()=>{
        setQuestions(props.questions);
    },[props.questions])

    const handleDelete = (el) =>
    {
        if(el) props.deleteQuestion(el)
    }

    const addExam = (data) =>
    {
        const questions = props.questions.map(el=>{el=JSON.parse(el); return el.id})
        axios.post('/api/exams/',{
            name: data.name,
            questions: questions,
            assignedTo: data.group,
            active: false,
        },{headers: {'x-access-token':token}})
        .catch(err=>document.location.reload(true))
    }

    return(
        <div className='Container__App Container__App__Exam'>
            <h2>Egzamin</h2>
            <ol>
            {
                props.questions.map(el=>{ el=JSON.parse(el); return<li key={el.id}><span>{el.content}</span><button onClick={()=>handleDelete(el)}><DeleteForeverIcon/></button></li>})
            }
            </ol>
            <form onSubmit={handleSubmit(addExam)}>
            <input type='text' {...register('name',{ required: true, minLength: 1})} placeholder='Nazwa Egzaminu' />
                <select placeholder='Wybierz Grupę' {...register('group')}>
                    {groupList.map(el=>(<option key={el._id} value={el._id}>{el.name}</option>))}
                </select>
                <div className='form__controls'>
                    <button type='button'>Wyczyść</button>
                    <input type='submit' value='Zapisz'/>
                </div>
            </form>
        </div>)
}

export default AddExam;
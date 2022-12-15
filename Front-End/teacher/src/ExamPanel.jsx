import {React, createContext, useEffect,useState, useContext} from 'react';
import {Token} from './App'
import AddExam from './AddExam';
import AddQuestion from './AddQuestion'
import './scss/exam.scss'
import { List } from '@mui/material';

export const Exam = createContext();

const ExamPanel = props =>
{
    const [list, setList] = useState(new Set());

    function handleAdd(question)
    {
        if(question&&question!=="") 
        {
            const newList = new Set(list);
            newList.add(question)
            setList(newList);
        }
    }

    async function handleDelete(question)
    {
        if(question&&question!=="") {
            const temp = new Set(list);
            temp.forEach(el=>el===JSON.stringify(question)? temp.delete(el) : el);
            await setList(temp)
        }
    }
    
    return(
        <div className='Container'>
            <AddExam questions={Array.from(list)} deleteQuestion={question=>handleDelete(question)}/>
            <AddQuestion setList={question=>handleAdd(question)} />
       </div>);
}

export default ExamPanel;
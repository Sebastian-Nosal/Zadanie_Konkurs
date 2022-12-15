import axios from 'axios';
import { React, useState, useEffect, useContext, useMemo } from 'react';
import { Token } from './App';
import { CircularProgress } from '@mui/material';
import {Switch} from '@mui/material'
import AssessmentIcon from '@mui/icons-material/Assessment';
import DeleteIcon from '@mui/icons-material/Delete';
import AnswerPanel from './AnswersPanel'
import './scss/panel.scss'

const Panel = props =>
{
    const {token, me, setMe,setGroupList, groupList, setCopiedExam} = useContext(Token)
    const [loading,setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState('')
    const [exams,setExams] = useState([])

    function getFromApi()
    {
        let currectUser;
        console.log(token)
        if(token!=='')
        {
            axios.get('/api/users/me',{headers: {'x-access-token':token}})
            .then(({data})=>
                {
                    console.log('1')
                    currectUser = data.name;
                    setMe(currectUser);
                    
                },err=>{
                    console.log(err.data)
                    //document.location.reload(true)
                })
            .then(()=>
            {
                axios.get('/api/groups/?teacher='+currectUser, {headers: {'x-access-token':token}})
                .then(({data})=>
                    {
                        console.log('2')
                        setGroupList(data);
                    } 
                    ,err=>
                    {
                        console.log(err.data)
                        //document.location.reload(true)
                    })
            .then(()=>
            {
                axios.get('/api/exams/?author='+currectUser, {headers: {'x-access-token':token}})
                .then(({data})=>
                    {
                        console.log('3')
                        setExams(data)
                    }
                    ,err=>
                    {
                        console.log(err.data)
                        document.location.reload(true)
                    })
                })
            })
            .finally((setLoading(false)))
        }
    }

    function handleActive(id,active)
    {
        console.log(!active)
        axios.patch('/api/exams/'+id,{
            active:!active
        } ,{headers: {'x-access-token':token}})
        .then(data=>{
            console.log(data);
        }, err=>document.location.reload(true))
        .then(()=>{
          axios.get('/api/exams/?author='+me, {headers: {'x-access-token':token}})
            .then(({data})=>{setExams(data)},err=>document.location.reload(true))
        })
    }

    function handleDeleteExam(id)
    {
        axios.delete('/api/exams/'+id, {headers:{'x-access-token':token}}).then(res=>console.log(res.data),err=>console.log(err.data)).then(()=>{
            axios.get('/api/exams/?author='+me, {headers: {'x-access-token':token}})
            .then(({data})=>{setExams(data)},err=>console.log(err.data))
        })
    }

        
    
    function handleDisplayAnswers(exam)
    {
       setSelectedAnswer(exam)
    }

    useEffect(getFromApi,[token])

    if(loading) return <div className='container'> <CircularProgress /></div>
    else return (
        <div className='container'> 
            {selectedAnswer!==''? <AnswerPanel setAnswer={setSelectedAnswer} id={selectedAnswer}/> : ''}
            <div className='App'>
                <h1>Witaj {me}</h1>
                <ul>
                    {exams.map(el=>(
                        <li key={el._id}>
                            <div className='App__exam-name'>{el.name}</div>
                            <div className='App__exam-active'><Switch checked={el.active} onChange={()=>handleActive(el._id,el.active)}/></div>
                            <span className='App__group-name'>{groupList.find(gr=>gr._id===el.assignedTo).name}</span>
                            <div className='App__controlls'>
                                <button onClick={()=>handleDisplayAnswers(el._id)}><AssessmentIcon/> </button>
                                <button onClick={()=>handleDeleteExam(el._id)}><DeleteIcon/> </button>
                            </div>
                        </li>
                        
                        ))}
                </ul>
            </div>
        </div>
    )
}

export default Panel;
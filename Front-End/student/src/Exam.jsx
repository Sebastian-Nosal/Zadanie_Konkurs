import React, {useState, useEffect} from "react";
import Quiz from "./Quiz";
import BeenhereIcon from '@mui/icons-material/Beenhere';
import './scss/exam.scss'
import MouseIcon from '@mui/icons-material/Mouse';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Refresh from "@mui/icons-material/Refresh";
import axios from "axios";

const Exam = props  =>
{
    const [current, setCurrent] = useState([props.exam.questions[0],0]);
    const [answers, setAnswers] = useState(new Array(props.exam.questions.length))

    function selectQuestion({target},questions, number)
    {
        target.classList.add('selected');
        setCurrent([questions,number]);
    }

    function addAnswerToList(answer)
    {
        let newAnswers = answers;
        newAnswers[current[1]] = answer;
        setAnswers(newAnswers);
    }
    
    function previous()
    {
        if(current[1]>=1)
        {
            const temp = [props.exam.questions[current[1]-1],current[1]-1];
            console.log(temp)
            setCurrent(temp);
            const toSelect = document.querySelector(`li:nth-child(${current[1]-1})`)
            toSelect.classList.add('clicked')
            
        }
    }

    function next()
    {
        if(current[1]<props.exam.questions.length) 
        {
            const temp = [props.exam.questions[current[0]+1],current[1]+1];
            setCurrent(temp);
            console.log('temp')
            console.log(temp)
            document.querySelector(`li:nth-child(${current[1]+1})`).classList.add('clicked')
        }
    }
    
    function refresh()
    {
        const temp = [props.exam.questions[0],0]
        setCurrent(temp)
        setAnswers(new Array(props.exams.questions.length))
    }

    function removeAnswer()
    {
        let temp = answers;
        //console.table(temp)
        temp[current[1]]="";
        setAnswers(temp)
    }

    function sendAnswer()
    {
        axios.post('/api/answers/', 
            {
                'examId': props.exam._id,
                'answers': answers,
                'token': props.token 
            }
        )
        .then(refresh())
        .then(()=>props.setMode(0))
    }

    return(
    <div className="Container">
        <div className="Container__column--side">
            <div className="Questions-Container">
                <ul>
                    {props.exam.questions.map((el,index)=>(<li key={el}><button onClick={(event)=>selectQuestion(event,el,index)}><span>Pytanie {index+1}</span> <MouseIcon/></button></li>))}
                </ul>
            </div>
        </div>

        <div className="Container__column">
            <main>
                <Quiz questionId={current[0]} questionNumber={current[1]} 
                    setAnswers={(answer)=>addAnswerToList(answer)}
                    selectedAnswer={answers[current[1]]}
                />
            </main>
        </div>
        <div className="Container__column--side"  style={{float: 'right'}}>
            <aside>
                <div className="Controlls-Container">
                    <button onClick={()=>{previous()}}><ArrowBackIcon/></button>
                    <button onClick={()=>{Refresh()}}><RefreshIcon/></button>
                    <button onClick={()=>{sendAnswer()}}><BeenhereIcon/></button>
                    <button onClick={()=>{removeAnswer()}}><BackspaceIcon/></button>
                    <button onClick={()=>{next()}}><ArrowForwardIcon/></button>
                </div>
            </aside>
        </div>
        
    </div>
    )
}

export default Exam;
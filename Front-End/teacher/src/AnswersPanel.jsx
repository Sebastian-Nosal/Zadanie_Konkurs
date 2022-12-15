import {React, useEffect, useState, useContext} from "react";
import CloseIcon from '@mui/icons-material/Close';
import './scss/answers.scss';
import axios from "axios";
import { Token } from "./App";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
  
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
        position: 'top',
        },
        title: {
        display: true,
        text: 'Oceny Uczniów z Egzaminu',
        },
    },
    scales: {
        y:
        {
            //type: 'percent',
            min: 0,
            max: 100,
            
        }
    }
}


const AnswerPanel = props =>
{
    const [answers,setAnswers] = useState([]);
    const [corrects,setCorrects] = useState([]);
    const [isError,setIsError] = useState(false)
    const {token} = useContext(Token);

    useEffect(()=>{
        loadFromApi()
        .then(()=> generateResult());
    },[props])

    function handleClose()
    {
        props.setAnswer('');
    }

   async function loadFromApi()
    {
        await axios.get('/api/answers/?exam='+props.id, {headers: {'x-access-token':token}})
        .then(({data})=>{
            const temp = data
            setAnswers(temp)
        },err=>document.location.reload(true));

        await axios.get('/api/exams/'+props.id)
        .then(({data})=>{
            const toCorrect = data.questions.map(el=>el.correct)
            setCorrects(toCorrect);
        },err=>setIsError(true))
    }

    function generateResult()
    {
        let display = [];
        const temp = [];
        answers.map(answer=>
            {
                let points = 0;
                answer.answers.forEach((el,inx) =>{
                    if(el.toUpperCase()===corrects[inx])
                    {
                        points++
                    }
                });
                display.push(
                    <li key={answer._id}><span>{answer.user}</span><strong>{points}/{corrects.length}</strong><span className="Panel_Results__percentage">{points/(corrects.length)*100}%</span></li>
                )
                temp.push(points);
            })
            return display;
    }

    function generateChart()
    {
        let result = [];
        answers.map(answer=>
            {
                let points = 0;
                answer.answers.forEach((el,inx) =>{
                    console.log(el.toUpperCase())
                    console.log(corrects[inx])
                    if(el.toUpperCase()===corrects[inx])
                    {
                        points++
                    }
                });
                result.push(points)
            })
            console.log(result)
        console.log('generating chart')
        const labels = answers.map(el=>el.user)
        const data = {
            labels,
            datasets: [
              {
                label: 'Wynik Procentowy',
                data: result.map((el,idx) => el/corrects.length*100),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              }
            ],
          };

          return <Bar options={options} data={data} />
    }

    return(
        <div className="Layout">
            <div className="Panel">
                <header>
                    <button onClick={handleClose} className="Panel__close-button"><CloseIcon/></button>
                </header>
                <section className="Panel__Results">
                <ul>
                    
                    {generateResult()}
                </ul>
                </section>
                <section className="Panel__Graph">
                    {generateChart()}
                </section>
            </div>
        </div>
    )

    // Odpowiedzi{JSON.stringify(answers)}
    // Poprawne {JSON.stringify(corrects)}
}

export default AnswerPanel
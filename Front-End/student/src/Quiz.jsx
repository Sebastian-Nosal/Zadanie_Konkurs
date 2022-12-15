import axios from "axios";
import React from "react";
import './scss/quiz.scss'

class Quiz extends React.Component
{
    constructor(props)
    {
        super(props);
        
        this.state = {
            content: "",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: "",
            img: "",
            correct: ""
        }

        this.loadQuestionFromAPI = this.loadQuestionFromAPI.bind(this);
        this.renderImage = this.renderImage.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount()
    {
        this.loadQuestionFromAPI()
    }

    componentDidUpdate(prevProps)
    {
        if(prevProps.questionId!==this.props.questionId) this.loadQuestionFromAPI();
        const clicked =  document.querySelector('.clicked')
        if(clicked) clicked.classList.remove('clicked')
    }

    render()
    {
        return (
            <div className="app">
                {this.props.questionNumber>=0? (<h1>Pytanie {this.props.questionNumber+1}</h1>) : (<h1>Pytanie</h1>)}
                <div className="app__content">
                    <p>{this.state.content}</p>
                    {this.renderImage()}
                    <span>A) {this.state.answerA}</span>
                    <span>B) {this.state.answerB}</span>
                    <span>C) {this.state.answerC}</span>
                    <span>D) {this.state.answerD}</span>
                </div>
                <div className="app-buttons-container">

                        <button className="app-buttons-container__Button" id="answer-a" onClick={(event)=>this.handleClick('A',event)}>A</button>
                        <button className="app-buttons-container__Button" id="answer-b" onClick={(event)=>this.handleClick('B',event)}>B</button>
                        <button className="app-buttons-container__Button" id="answer-c" onClick={(event)=>this.handleClick('C',event)}>C</button>
                        <button className="app-buttons-container__Button" id="answer-d" onClick={(event)=>this.handleClick('D',event)}>D</button>
                    
                </div>
            </div>
        )
    }

    loadQuestionFromAPI()
    {
        axios.get('/api/questions/'+this.props.questionId)
        .then(response=>
            {
                const { content, answerA,answerB, answerC,answerD, img, correct} = response.data;
                const  newState = { content:content, answerA:answerA,answerB:answerB, answerC: answerC,answerD: answerD, img:img||"", correct:correct}
                if(JSON.stringify(newState)!==JSON.stringify(this.state)) this.setState(newState);
            })
        .catch(err=>console.log(err.response))
    }

    renderImage()
    {
        console.log('11')
        let url;
       /* const extensions = ['.jpg','.jpeg','.png','.svg']
        extensions.forEach(el=>{
            const localUrl = 'http://127.0.0.1:8080/static/images/upload/'+this.props.questionId+el;
            const result = axios.get(localUrl)
            result.then(res=>{
                if(res.status===200)
                {
                    url = localUrl;
                }
            })
        })*/
        url='/static/images/upload/'+this.props.questionId+'.png';
        console.log(url)
        console.log(this.state.img)
        if(this.state.img) return <img src={url} alt='plik graficzny zadania'/>
    }

    async handleClick(answer,{target})
    {
        await this.props.setAnswers(answer);
        if(this.props.sendCorrect) this.props.sendCorrect(this.state.correct)
        target.classList.add('clicked')
    }

}

export default Quiz

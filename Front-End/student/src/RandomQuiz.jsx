import axios from "axios";
import React from "react";
import Quiz from "./Quiz";
import { CircularProgress } from "@mui/material";
import './scss/randomQuiz.scss'
import RefreshIcon from '@mui/icons-material/Refresh';

class RandomQuiz extends React.Component
{

    constructor(props)
    {
        super(props);

        this.state = {
            question: "",
            loading: true,
            answer: ""
        }
        this.loadFromApi = this.loadFromApi.bind(this);
    }

    async loadFromApi()
    {
        try 
        {
            const result =  await axios.get('/api/questions/?tag='+this.props.tag,  {headers:{'x-access-token': this.props.token}})
            const random = Math.floor(Math.random()*result.data.length);
            this.setState({
                question: result.data[random]._id
           })
        }
        catch(err)
        {
            console.log(err.data);
        }
        this.forceUpdate();

    }

    checkIfCorrect(correct)
    {
        document.querySelector('.app').classList.remove('correct', 'incorrect')
        if(this.state.answer.toLowerCase()===correct.toLowerCase()) document.querySelector('.app').classList.add('correct')
        else document.querySelector('.app').classList.add('incorrect')
        this.forceUpdate();
    }

    componentDidMount()
    {
        const load = this.loadFromApi();
        load.catch(err=>{this.setState({err: true})});
        load.then(this.setState({loading:false}));
    }

    render(){
        return(
            <>
               {this.state.loading? (<CircularProgress/>) : (<Quiz questionId={this.state.question} setAnswers={(answer)=>this.setState({answer:answer})} sendCorrect={(correct)=>{this.checkIfCorrect(correct)}}/>)}
               <div className="Toolbar">
                    <button onClick={()=>this.loadFromApi()}><RefreshIcon/></button>
               </div>
            </>
        )
    }

    
}

export default RandomQuiz;
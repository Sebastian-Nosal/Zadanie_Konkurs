import React from "react";
import axios from 'axios';
import { CircularProgress } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import {TextField} from "@mui/material";
import './scss/panel.scss'

class Panel extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            user: false,
            group: false,
            exam: false,
            err: false,
            loading: true
        };

        this.getUserDataFromAPI = this.getUserDataFromAPI.bind(this);
        this.getUsersGroupsFromAPI = this.getUsersGroupsFromAPI.bind(this);
        this.getUsersExamsFromAPI = this.getUsersExamsFromAPI.bind(this);
        this.handleGetters = this.handleGetters.bind(this);
        this.handleExamSelect = this.handleExamSelect.bind(this);
        this.handleTagSelect = this.handleTagSelect.bind(this);
        this.tag = "";
    }

    componentDidMount()
    {
        const token = this.props.token
        if(this.state.loading) this.handleGetters(token)    
    }

    componentWillUnmount()
    {
        if(this.tag!=="")
        {
            this.props.changeTag(this.tag)
        }
    }

    render() {
        if(this.state.err||this.state.loading||!this.state.user)
        {
            return(
                <div style={{width: "100vw", textAlign: 'center', marginTop: "30px"}}>
                     <CircularProgress  sx={{width: '50vh', height: '50vh', textAlign: 'center'}}/>
                </div>   
            )
        }
        return(
            <div className="panel">
                <h1>Panel użytkownika</h1>
                <div className="panel-bar">
                    <h2>Email: {this.state.user.name}</h2>
                    <SchoolIcon sx={{width: "40px"}}/>
                </div>
                <ul>
                    {this.state.exam.map(el=>(
                        <li key={el._id}><span>Egzamin: <strong> {el.name} </strong></span><span>Status: {el.active? "Aktywny" : "Nie aktywny"}</span> {el.active?<button onClick={(ev)=>this.handleExamSelect(ev,el)}>Wybierz</button>: (<button disabled>Wybierz</button>)}</li>
                    ))}
                </ul>
                <div className="panel-bar">
                    <TextField
                        id=""
                        className="panel-bar__input"
                        label="Podaj Tag pytań jakie Cię interesują"
                        value={this.state.name}
                        onChange={(ev)=>this.handleTagSelect(ev)}
                        margin="normal"
                        required={false}
                    />
                </div>
            </div>)
    
    }

    //My methods

    async handleGetters(token)
    {
       
            const user = await this.getUserDataFromAPI(token)
            const group = await this.getUsersGroupsFromAPI(token,user)
            const exams = await this.getUsersExamsFromAPI(token,group,user)

            this.setState(
                {
                    user: user,
                    group: group,
                    exam: exams,
                    loading: false
                }
            )
    }
    
    async getUserDataFromAPI(token)
    {
        try 
        {
            const response = await axios.get('/api/users/me', {
                headers: {
                    'x-access-token':token
                }});
              
            return response.data
        }
        catch(err)
        {
            this.setState({err:true});
            setTimeout(this.getUserDataFromAPI,60_000)
        }
    }

    async getUsersGroupsFromAPI(token, user)
    {
        try
        {
            const response = await axios.get('/api/groups/?member='+user.name, {
                headers: {
                    'x-access-token':token
                }});

            return response.data;
        }
        catch(err)
        {
            this.setState({err:true});
        }
        
    }

    async getUsersExamsFromAPI(token,group,user)
    {  
        let temp = [];
        try{ 
            group.forEach(el=>{
               temp.push(axios.get('/api/exams/?assigned='+el._id, {
                    headers: {
                        'x-access-token':token
                    }
                }));  
            });
            temp = await Promise.all(temp);
            let result = [];
            temp.forEach(el=> result = result.concat(el.data))
           
            return result;
            
        }
        catch(err)
        {
            this.setState({err:true});
        }

    } 
    
    handleExamSelect(event,exam)
    {
        event.target.classList.add('selected');
        this.props.handleExam(exam);
    }

    handleTagSelect(event)
    {
        const temp = event.target;
        this.tag = temp.value;
    }
}

export default Panel;
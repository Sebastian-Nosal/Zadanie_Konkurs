import React from "react";
import Menu from "./Menu";
import FooterComponent from "./Footer"
import Panel from "./Panel"
import Exam from './Exam'
import RandomQuiz from './RandomQuiz'
import Cookies from 'js-cookie';

class App extends React.Component
{
   constructor(props)
   {
        super(props);
        this.state = {
            mode: 0, 
            token: "",
            selectedExam: "",
            tag: ""
        };
        this.handleModeChange = this.handleModeChange.bind(this);
        this.modeChooser = this.modeChooser.bind(this);
        this.changeSelectedExam = this.changeSelectedExam.bind(this)
        this.handleTagChange = this.handleTagChange.bind(this);
   }

   componentDidMount()
   {
        console.log("Cookie token " + Cookies.get('token'))
        this.setState({
            token: Cookies.get('token')
        })
   }
    
   handleModeChange(newMode)
   {
        this.setState({
            mode: newMode,
        })
        this.forceUpdate()
   }

   handleTagChange(id)
   {
        this.setState({
            tag: id,
        })
   } 

   modeChooser()
   {
        // eslint-disable-next-line default-case
        if(this.state.token!=="")
        {
            switch(this.state.mode)
            {
                case 0:
                    return (<Panel token={this.state.token} handleExam={this.changeSelectedExam} changeTag={this.handleTagChange} />);
                    break;
                case 1:
                    if(this.state.selectedExam!=="") return (
                    <Exam exam={this.state.selectedExam}
                        token={this.state.token}
                        setMode={(mode)=>this.handleModeChange(mode)}
                    />);
                    break;
                case 2:
                    if(this.state.tag!=="") return (<RandomQuiz tag={this.state.tag} token={this.state.token}/>);
                    break;

                default:
                    return (<Panel token={this.state.token} handleExam={this.changeSelectedExam} changeTag={this.handleTagChange} />);

                
            }
        }
   }

   changeSelectedExam(id)
   {
        this.setState({
            selectedExam:id
        })
   }

    render()
    {
        return (
        <div className="site-container">
            <Menu mode={this.state.mode} handleModeChange={this.handleModeChange} />
                {this.modeChooser()}
            <FooterComponent/>
        </div>)
    }
}

export default App;
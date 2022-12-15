import {React, useState, useEffect, createContext} from 'react';
import './scss/main.scss';
import Menu from './Menu';
import Footer from './Footer';
import ExamPanel from './ExamPanel';
import GroupPanel from './GroupPanel';
import Panel from './Panel';
import Cookies from 'js-cookie';
import axios from 'axios';

export const Token = createContext();

function App()
{
    const [mode, setMode] = useState();
    const [token, setToken] = useState('');
    const [me,setMe] = useState('');
    const [groups,setGroups] = useState([]);
    //const [copiedExam,setCopiedExam] = useState(null)
     
    useEffect(()=>{
        const cookie = Cookies.get('token');
        console.log(cookie)
        setToken(cookie)
    },[])
    
    function chooseMode()
    {
        switch(mode)
        {
            case 0:
                return(<ExamPanel/>);
                break;

            case 1:
                return(<GroupPanel />);
                break;

            case 2:
                return(<Panel/>);
                break;

            default:
                return(<Panel/>)
        }
    }

    return (
            <Token.Provider value={{token:token, me:me, setMe:setMe, groupList:groups, setGroupList:setGroups}}>
                <Menu handleModeChange={newMode=>setMode(newMode)}/>
                    {chooseMode()} 
                <Footer/>
            </Token.Provider>)
}

export default App;

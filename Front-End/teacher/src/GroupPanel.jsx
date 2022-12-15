import axios from 'axios';
import {React, useState,useEffect, useContext} from 'react';
import { useForm } from 'react-hook-form';
import { Token } from './App';
import DeleteIcon from '@mui/icons-material/Delete';

import './scss/group.scss'

const GroupPanel = props =>
{
    const [groupList,setGroupList] = useState([]);
    const [toInsert,setToInsert] = useState(new Set())
    const [toDelete,setToDelete] = useState(new Set())
    const [group,setGroup] = useState({})
    const {token, me} = useContext(Token);
    const{ register, handleSubmit } = useForm();

    useEffect(()=>{
        if(token!=='') loadFromAPI()
    },[token])

    function loadFromAPI()
    {
        axios.get('/api/groups?teacher='+me,{headers:{'x-access-token':token}})
        .then(res=>setGroupList(res.data));
    }

    function changeGroup(group)
    {
        setGroup(group);
        document.getElementById('name').value=group.name||'';
    }

    function dropMember(index, target)
    {
        if(index) 
        {
            const newToDelete = new Set(toDelete);
            newToDelete.add(group.members[index]);
            setToDelete(newToDelete)
            
            const newGroup = {...group}
            delete newGroup.members[index]
            setGroup(newGroup)
    }

        target.parentNode.style.display = 'none'
    }

    function addMember()
    {
        const input= document.getElementById('newMember');
        const value = input.value;
        if(value!=='')
        {
            const newGroup = {...group};
            if(JSON.stringify(group)==='{}')  newGroup.members = [];
            newGroup.members.push(value)
            setGroup(newGroup)

            setToInsert(prevstate=>{
                prevstate.add(value)
                return prevstate
            })
        }
        input.value = "";
    }

    function handleOnSubmit(data)
    {
        const insert = Array.from(toInsert);
        const drop = Array.from(toDelete);

        if(group._id)
        {
            axios.patch('/api/groups/'+group._id,{
                toInsert: insert,
                toDelete: drop,
            },{
                headers:
                {
                    'x-access-token':token
                }
            })
            .catch(err=>document.location.reload(true))
        }
        else
        {
            axios.post('/api/groups/',{
                members: group.members,
                name: data.name
            },{
                headers:
                {
                    'x-access-token':token
                }
            })
            .then(()=>loadFromAPI(),err=>document.location.reload(true))
        }

        setToInsert(new Set())
        setToDelete(new Set())
    }

    function deleteGroup()
    {
        axios.delete('/api/groups/'+group._id, {
            headers: {
                'x-access-token': token
            }
        })
        .then(res=>console.log(res),err=>document.location.reload(true))
    }

    return(
        <div className='App'>
        <h1>Zarządzanie Grupami</h1>
            <div className='App__Group-List'>
                <ul>
                    {groupList.map(el=>
                    (
                        <li onClick={()=>changeGroup(el)} key={el.name}><h2>{el.name}</h2></li>
                    ))}
                    <li onClick={()=>changeGroup({})}>Nowa</li> 
                </ul>
            </div>

            <div className='App__Group-Form'>
                <form onSubmit={handleSubmit(handleOnSubmit)}>
                    <div className='App__Group-Form__Header'>
                        <input id='name' type='text' {...register('name', {minLength: 1})} disabled={group.name!==undefined||false} placeholder='Nazwa Grupy'/>
                        <button onClick={deleteGroup} type='button'><DeleteIcon/></button>
                    </div>
                    <ul>
                        {group.members? group.members.map((el, index)=>(<li key={el}>{el} <button type='button' onClick={({target})=>dropMember(index,target)}>X</button></li>)) : <h3>Brak członków Grupy</h3>}
                        <li><input type='text' id='newMember' placeholder='Nowy'/><button type='button' onClick={()=>addMember()}>+</button></li>
                    </ul>
                    <input type='submit' value={group._id? 'Zmodyfikuj' : 'Dodaj'}/>
                </form>
            </div>
        </div>
    )
}

export default GroupPanel;
import React from "react"
import { useState } from "react";
const Menu = (props) => {

    const [open,setOpen] = useState(false);

    function handleClick(event,mode)
    {
        document.querySelectorAll('.selected').forEach(el=>el.classList.remove('selected'));
        event.target.classList.add('selected');
        props.handleModeChange(mode);
    }

    function handleOpenClose(event)
    {
        setOpen(!open);
        if(open) document.querySelector('nav').style.display='flex';
        else document.querySelector('nav').style.display='none' 
    }

    return (
        <header>
        <button className="menu" id="menu" onClick={handleOpenClose}>
        ☰
        </button>
            <nav>
                <button onClick={(event)=>handleClick(event,0) }>Główna</button>
                <button onClick={(event)=>handleClick(event,1)}>Wczytaj Egzamin</button>
                <button onClick={(event)=>handleClick(event,2)}>Losowe Pytanie</button>
            </nav>
        </header>)
    
}

export default Menu;
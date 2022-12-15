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
        if(open) document.querySelector('nav').style.width='100%';
        else document.querySelector('nav').style.width='0px' 
    }

    return (
        <header>
        <button className="menu" id="menu" onClick={handleOpenClose}>
        ☰
        </button>
            <nav>
                <button onClick={(event)=>handleClick(event,0)}>Egzaminy</button>
                <button onClick={(event)=>handleClick(event,1)}>Grupy</button>
                <button onClick={(event)=>handleClick(event,2)}>Panel</button>
            </nav>
        </header>)
    
}

export default Menu;
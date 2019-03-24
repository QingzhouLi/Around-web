import React from 'react';
import {Register} from "./Register"
import {Login} from "./Login"
import {Home} from "./Home"

export class Main extends React.Component{
    render(){
        return (
            <div className = "main" >
                <Register />
                <Login />
                <Home />
            </div>
        );
    }
}


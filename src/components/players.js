import React from "react";
import axios from "axios";

export default class Players extends React.Component
{
    constructor(props)
    {
        super(props);
    }    

    state = {
        run: true,
        player: ""  
    }

    getPlayer = () => {
        console.log("run");
        axios.get("https://www.speedrun.com/api/v1/users/" + this.props.id)
            .then(playerjson => {
                this.setState({player: playerjson.data.data.names.international, run: false});
            });
    }

    render()
    {
        console.log("helo");
        if(this.state.run)
        {
            this.getPlayer();
            return <div />
        }
            
        return(
            this.state.player
        );
    }
}
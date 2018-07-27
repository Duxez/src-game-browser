import React from "react";
import { Table } from "reactstrap";
import Players from "./players";
import axios from "axios";

export default class Leaderboard extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    state = {
        players: null,
        times: null,
        shouldRun: this.props.shouldRun,
    }

    basestate = this.state;

    hadPlayers = false;

    toHHMMSS = timing => {
        let hours = Math.floor(timing / 3600);
        let minutes = Math.floor((timing - (hours * 3600)) / 60);
        let seconds = timing - (hours * 3600) - (minutes * 60);

        if(hours < 10) 
            hours = "0" + hours;
        if(minutes < 10)
            minutes = "0" + minutes;
        if(seconds < 10)
            seconds = "0" + seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    getLeaderboardData = () =>
    {
        axios.get("https://www.speedrun.com/api/v1/leaderboards/" + this.props.gameid + "/category/" + this.props.categoryId)
            .then(json => {
                let runs = json.data.data.runs;
                let players = [];
                let times = [];
                for(let i = 0; i < runs.length; i++)
                {
                    players[i] = <Players id={runs[i].run.players[0].id}/>;
                    times[i] = this.toHHMMSS(runs[i].run.times.primary_t);
                    
                }
                this.setState({players: players, shouldRun: false, times: times});
            });
    }

    shouldComponentUpdate()
    {
        if(this.hadPlayers && !this.state.shouldRun)
            return false;

        return true;
    }

    render()
    {
        if(this.state.shouldRun)
        {
            this.getLeaderboardData();
            return <div />;
        }

        if(!this.state.shouldRun && !this.hadPlayers)
            this.hadPlayers = true;

        if(!this.state.shouldRun && this.hadPlayers)
            this.setState(this.basestate);

        const playerdata = this.state.players.map((name, index) => <tr><th>{index +1}</th><td>{name}</td><td>{this.state.times[index]}</td></tr>);
        return(
            <Table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Player</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {playerdata}
                </tbody>
            </Table>
        );
    }
}
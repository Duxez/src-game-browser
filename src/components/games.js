import React from "react";
import axios from "axios";
import { ListGroup, ListGroupItem, Button, Input, Jumbotron, TabContent, TabPane, Nav, NavItem, NavLink, Table } from "reactstrap";
import classnames from "classnames";
import Players from "./players";
import Leaderboard from "./leaderboard";

export default class Games extends React.Component {

    constructor(props)
    {
        super(props);
    }
    state = {
        gottenGames: false,
        games: null,
        searchquery: "",
        width: "100%",
        withSearch: false,
        shouldRerender: true,
        gameids: null,
        display: "none",
        top: "38px",
        name: "",
        categoryNames: null,
        categoryIds: null,
        gameid: null,
    };

    nameToAdd = "";

    getGames = (searchquery = null, clearlist = false) => {
        let offset = 0;
        if(this.state.games !== null)
            offset = this.state.games.length;
        
        if(clearlist)
            this.setState({games: null, shouldRerender: false, gameids: null});
        
        if(searchquery === null || searchquery === "")
        {
            if(this.state.withSearch)
            {
                this.setState({games: null, shouldRerender: false, gameids: null});
                offset = 0;
            }
            axios.get("https://www.speedrun.com/api/v1/games?offset=" + offset)
                .then((json) => {
                    let games = [];
                    let gameids = [];
                    if(this.state.games !== null)
                    {
                        games = this.state.games;
                        gameids = this.state.gameids;
                    }
                    for(let i = 0; i < json.data.data.length; i++)
                    {
                        games[offset + i] = json.data.data[i].names.international;
                        gameids[offset + i] = json.data.data[i].id;
                    }
                    this.setState({games: games, withSearch: false, gameids: gameids});
                });
        }
        else
        {
            if(!this.state.withSearch)
            {
                this.setState({games: null, shouldRerender: false, gameids: null});
                offset = 0;
            }

            searchquery = searchquery.replace(" ", "%20");
            axios.get("https://www.speedrun.com/api/v1/games?offset=" + offset + "&name=" + searchquery)
                .then((json) => {
                    let games = [];
                    let gameids = [];
                    if(this.state.games !== null)
                    {
                        games = this.state.games;
                        gameids = this.state.gameids;
                    }
                    for(let i = 0; i < json.data.data.length; i++)
                    {
                        games[offset + i] = json.data.data[i].names.international;
                        gameids[offset + i] = json.data.data[i].id;
                    }
                    this.setState({games: games, withSearch: true, gameids: gameids});
                });
        }
    }

    handleChange = event => {
        this.setState({searchquery: event.target.value});
    }

    handleClick = name => {
        let index;
        for(let i = 0; i < this.state.games.length; i++)
        {
            if(this.state.games[i] === name)
                index = i;
        }

        axios.get("https://www.speedrun.com/api/v1/games/" + this.state.gameids[index] + "/categories")
            .then(json => {
                let categoryNames = [];
                let categoryIds = [];
                for(let i = 0; i < json.data.data.length; i++)
                {
                    categoryNames[i] = json.data.data[i].name;
                    categoryIds[i] = json.data.data[i].id;
                }
                this.setState({categoryNames: categoryNames, categoryIds: categoryIds, gameid: this.state.gameids[index], display: "block", width: "50%"});
            });
    }

    // getLeaderboards = (gameid, categoryid) =>
    // {
    //     axios.get("https://www.speedrun.com/api/v1/leaderboards/" + gameid + "/category/" + categoryid)
    //         .then(json => {
    //             let runs = json.data.data.runs;
    //             let players = [];
    //             for(let i = 0; i < runs.length; i++)
    //             {
    //                 players[i] = <Players id={runs.run.players[0].id}/>;
    //             }
    //             console.log(players); 
    //         });
    // } 

    render()
    {
        if(this.state.shouldRerender && this.state.games === null)
        {
            this.getGames();
        }
        if(this.state.games === null)
        {
            return(<div></div>);
        }
        const listitems = this.state.games.map((name) => <ListGroupItem onClick={() => {this.handleClick(name)}} tag="button" style={{textAlign:"left"}}>{name}</ListGroupItem>);

        let tabitems;
        let tabcontent;
            
        if(this.state.categoryNames !== null)
        {
            tabitems = this.state.categoryNames.map((name, index) => <div><h3>{name}</h3><Leaderboard categoryId={this.state.categoryIds[index]} gameid={this.state.gameid} shouldRun={true} /></div>)
            // tabcontent = 
        }

        // console.log(this.state.players);

        return(
            <div>
                <Input style={{width:"50%", float:"left"}} type="text" placeholder="Search" value={this.state.searchquery} onChange={this.handleChange} />
                <Button style={{width:'50%', float:"right"}} onClick={() => { this.getGames(this.state.searchquery, true) }} block color="primary">Search</Button>
                <ListGroup style={{float:"left", width:this.state.width}}>
                    {listitems}
                </ListGroup>
                <Button onClick={() => {this.getGames(this.state.searchquery)}} color="primary" size="lg" block>Load more games</Button>
                <Jumbotron style={{display: this.state.display, width: "50%", position: "absolute", top: this.state.top, right: 0}}>
                    <h3>{this.state.name}</h3>
                    {tabitems}
                </Jumbotron>
            </div>
        );
    }
}
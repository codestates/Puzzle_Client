import React from 'react';
import { withRouter } from "react-router-dom";
import styled from 'styled-components';

export default withRouter(({ location: { pathname } }) => (
    <>
        <Puzzle_SideBar_Containers_right>
            <Puzzle_SideBar_Title_Bar_Top></Puzzle_SideBar_Title_Bar_Top>
            <Puzzle_SideBar_Containers_Title>
                <Puzzle_SideBar_Title>{pathname.replace('/', '').toUpperCase()}</Puzzle_SideBar_Title>
            </Puzzle_SideBar_Containers_Title>
            <Puzzle_SideBar_Title_Bar_Top_Bottom></Puzzle_SideBar_Title_Bar_Top_Bottom>
        </Puzzle_SideBar_Containers_right>
    </>
));

// <------------ css ------------> //

const Puzzle_SideBar_Containers_right = styled.div`
    display: block;
    height:calc(100vh - 280px);
    flex-direction: column;
    align-items: center;
    width: 200px;
`

const Puzzle_SideBar_Containers_Title = styled.div`
    display:flex;
    height: 15%;
    width: 50px;
    justify-content: center;
    align-items: center;
    margin: 0 7em;
`

const Puzzle_SideBar_Title = styled.div`
    font-style:normal;
    font-weight:700;
    color:white;
    font-size: 2em;
    transform: rotate(90deg);
`

const Puzzle_SideBar_Title_Bar_Top = styled.div`
    background-color: #FA991D;
    height: 30%;
    width: 10px;
    margin: 5em 8em;
`

const Puzzle_SideBar_Title_Bar_Top_Bottom = styled.div`
    background-color: #FA991D;
    height: 30%;
    width: 10px;
    margin: 5em 8em;
`
import React from 'react';
import { Link, withRouter } from "react-router-dom";
import styled from 'styled-components';

export default withRouter(({ location: { pathname}}) => {

    return(
    <>
        <Puzzle_SideBar_Containers_left>
            <Puzzle_SideBar_category_ul>
                <Puzzle_SideBar_category_li>
                    <SLink current={pathname === "/home" ? 'true' : 'false'} to={{pathname: "/home",state:{pathname: 'HOME'}}}> HOME </SLink>
                </Puzzle_SideBar_category_li>

                <Puzzle_SideBar_category_li>
                    <SLink current={pathname === "/project" ? 'true' : 'false'} to="/project"> CURRENT<br/> PROJECT</SLink>
                </Puzzle_SideBar_category_li>

                <Puzzle_SideBar_category_li>
                    <SLink current={pathname === "/calendar" ? 'true' : 'false'} to="/calendar"> CALENDAR </SLink>
                </Puzzle_SideBar_category_li>
            </Puzzle_SideBar_category_ul>
        </Puzzle_SideBar_Containers_left>
    </>
)});

// <------------ css ------------> //
const Puzzle_SideBar_Containers_left = styled.div`
    display: flex;
    align-items: center;
    width: 300px;
    height:calc(100vh - 200px);
    float:left;
    bacground-color: rgb(60,85,109,0.5);
`

const Puzzle_SideBar_category_ul = styled.ul`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    height: 300px;
    box-sizing: border-box;
    padding: 1rem 1rem;
    border: #53303b 0px solid;
`

const Puzzle_SideBar_category_li = styled.li`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    color: white;
    font-size: 2em;
    text-decoration: underline;
    text-decoration-color: #21A598;
    text-underline-position: under;
    cursor: pointer;
`

const SLink = styled(Link)`
    color: white;
    &:visited{ color: white}
    text-decoration-color: ${props => props.current === 'true' ? "#FA991D" : "#21A598"}
`


import React from 'react';
import styled from 'styled-components';

const Puzzle_Footer = () => {
    return (
        <>
            <Puzzle_Footer_Containers>
                <Puzzle_Footer_Containers_Title_left>
                    <Puzzle_Footer_Title>ABO</Puzzle_Footer_Title>
                </Puzzle_Footer_Containers_Title_left>
                <Puzzle_Footer_Containers_Title_right>
                    <Puzzle_Footer_Title>HELP</Puzzle_Footer_Title>
                </Puzzle_Footer_Containers_Title_right>
            </Puzzle_Footer_Containers>
        </>
    )
}
const Puzzle_Footer_Containers = styled.div`
    display: flex;
    position: relative
    align-items: center;
    position: relative;
    width:100%; 
    height:60px;
    top: 5rem;
    box-sizing: border-box;
    padding: 1rem 0 0 0;

`

const Puzzle_Footer_Containers_Title_left = styled.div`
    display: flex;
    position: relative;
    bottom:0px;
    width:50%; 
    height:60px;
    justify-content: flex-start;
    align-items: flex-end;
    background: linear-gradient(to top, rgb(72, 25, 12, 0.5), rgb(25, 50, 77, 0.5));

`

const Puzzle_Footer_Containers_Title_right = styled.div`
    display: flex;
    position: relative;
    bottom:0px;
    width:50%; 
    height:60px;
    justify-content: flex-end;
    align-items: flex-end;
    background: linear-gradient(to top, rgb(72, 25, 12, 0.5), rgb(25, 50, 77, 0.5));

`

const Puzzle_Footer_Title = styled.div`
    position: absolute;
    top: 50%;
    transform: translatey(-50%);
    font-family: 'Roboto';
    font-style:normal;
    font-weight:700;
    color:white;
    font-size: 1em;
    text-decoration: underline;
    text-decoration-color: #21A598;
    text-underline-position: under;
    margin: 0 3em 0 2em;
`
export default Puzzle_Footer;
import React, { useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";
import styled from 'styled-components';
import axios from 'axios';
import Puzzle_logo from '../../../images/logo/Puzzle_Logo_Circle.png'
import { UserCircle } from '@styled-icons/boxicons-solid/UserCircle'

import Userinfo from '../template/Userinfo'


export default withRouter(({ location: { pathname } }) => {
    const [showUserinfoModal, setShowUserinfoModal] = useState(false);
    const [data,setData] = useState({});
    const [imageUrl, setImageUrl] = useState('');
    const accessToken = sessionStorage.getItem("accessToken");
    
    useEffect(() => {
        axios
        .get('https://api.teampuzzle.ga:4000/user/userinfo',{
            headers:{
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            withCredentials: true
        })
        .then(res => {
            const {data} = res.data;
            setImageUrl(data.profileImg)
            setData(data)
        })
    }, [])
    const openUserinfoModal = () => {
        setShowUserinfoModal(perv => !perv)
    }

    const syncImageUrl = (url) => {
        setImageUrl(url);
        console.log(imageUrl)
    }
    return(
    <>
        <Puzzle_Header_Containers>
            <Puzzle_Header_Logo />
            <Puzzle_Header_title>{pathname.replace('/', '').toUpperCase()}</Puzzle_Header_title>
            {
                !imageUrl ?
                    <Puzzle_Header_Userinfo onClick={openUserinfoModal}></Puzzle_Header_Userinfo>
                :   <Profile_Image onClick={openUserinfoModal} src={imageUrl}/>
            }
            <Userinfo
                data={data}
                showUserinfoModal={showUserinfoModal}
                setShowUserinfoModal={setShowUserinfoModal}
                syncImageUrl={syncImageUrl}
            />
        </Puzzle_Header_Containers>
    </>
)});

// <------------ css ------------> //

const Puzzle_Header_Containers = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 120px;
    box-sizing: border-box;
    padding: 2rem 5rem;
    background: linear-gradient(to bottom, rgb(72, 25, 12, 0.5), rgb(25, 50, 77, 0.5));

    border-bottom: rgb(127, 127, 127);
`

const Puzzle_Header_Logo = styled.div`
    position: relative;
    display: block;
    top: 0.8rem;
    background-image: url('${Puzzle_logo}');
    background-repeat: no-repeat;
    background-size: 90px;
    padding-bottom: 1.5rem;
    width: 90px;
    height: 90px;
`

const Puzzle_Header_title = styled.div`
    display: block;
    font-family: 'Roboto';
    font-style:normal;
    font-weight:700;
    font-size: 3.5em;
    text-decoration:underline;
    text-decoration-color: #FA991D;
    text-underline-position: under;
    color:white;
`

const Puzzle_Header_Userinfo = styled(UserCircle)`
    position: relative;
    top: 0.3rem;
    width: 70px;
    height: 70px;
    color:white;
    cursor: pointer;
`
const Profile_Image = styled.img`
    position: relative;
    top: 0.3rem;
    width: 70px;
    height: 70px;
    color:white;
    cursor: pointer;
    border-radius: 50%;
`
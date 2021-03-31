import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Home_Header from '../template/Header'
import Home_SideBar_Left from '../template/SideBarLeft'
import Home_SideBar_Right from '../template/SideBarRight'
import Home_Footer from '../template/Footer'
import axios from 'axios'
import ReactLoading from 'react-loading';



import Contents from './components/Contents'

import background_img from '../../../images/background/background.jpg'

const Home = (props) => {
  const refreshInfo = JSON.parse(sessionStorage.getItem('projectInfo'))

  const [projectData, setProjectData] = useState(refreshInfo);
  const [loading, setLoading] = useState(true);

  const accessToken = sessionStorage.getItem('accessToken')
  useEffect(() => {
    axios.get('https://api.teampuzzle.ga:4000/home',{
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }
    })
    .then(res => {
      let {projects} = res.data;
      setProjectData(projects)
      setLoading(false);
    })
    .catch(err => console.err(err))
  }, [])

  return (
    <Background>
      <Backgroundgradient>
        <Home_Header />
        <Calendar_Content_Containers>
          <Sidebar_Container>
            <Home_SideBar_Left />
          </Sidebar_Container>
          {loading ? (
              <LoadingContainer>
                <Loading>
                  <ReactLoading height={'10%'} width={'10%'} type={'spin'}/>
                </Loading>
              </LoadingContainer>
          ) : (
            <Contents projectData = {projectData} setProjectData={setProjectData} projectUp={props.projectUp} />
          )}
          <Sidebar_Right_Container>
            <Home_SideBar_Right />
          </Sidebar_Right_Container>
        </Calendar_Content_Containers>
        <Home_Footer />
      </Backgroundgradient>
    </Background>
  )
}

export default Home

// <------------ css ------------> //
const Background = styled.div`
  background-image: url('${background_img}');
  background-repeat: no-repeat;
  background-size: cover;
  height: 100vh;
  width: 100wh;
  background-attachment: scroll;
  
  @media ${props => props.theme.mobile} {
    background-color: red;
    width: 500px;
    height: 500px;
  }
  z-index: 2;
`
const Backgroundgradient = styled.div`
  background-repeat: no-repeat;
  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8));
  background-size: cover;
  height: 100vh;
  width: 100wh;
  
`

const Calendar_Content_Containers = styled.div`
  width: 100vw;
  height: calc(100vh - 280px);
  display: flex;
`

const Sidebar_Container = styled.div`
  
`
const Sidebar_Right_Container = styled.div`
  position: relative;
  right: 0.3rem;
  width: 11rem;
`

const LoadingContainer = styled.div`
  width: 70%;
  min-height: 100%;
  margin-left: 5rem;
  `

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 15rem;
`

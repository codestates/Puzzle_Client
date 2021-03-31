import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Slider from 'react-slick'
import axios from 'axios'
//라이브러리

import BackImg1 from './Img/LandingImg04.jpeg'
import BackImg2 from './Img/LandingImg01.jpg'
import BackImg3 from './Img/LandingImg03.jpg'
import BackImg4 from './Img/LandingImg02.jpg'

import { SignUp } from './user/SignUp'
import { Login } from './user/Login'

//컴포넌트

const Landing = () => {

  const [guestEmail, setExperienceID] = useState('guest@mail.com')
  const [guestPassword, setExperiencePw] = useState('1234')
  const [signUp, setSignUp] = useState(true)

  const history = useHistory()

  const experience = (event) => {
    axios
      .post('https://api.teampuzzle.ga:4000/user/guestlogin', {
        guestEmail,
        guestPassword,
      })
      .then(res => {
        event.preventDefault();
        sessionStorage.setItem('accessToken', res.data.accessToken)
        history.push('/home')
      })
      .catch(err => {
        setShowLoginErrorModal(perv => !perv)
      })
  }

  const settings = {
    dots: true,
    fade: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
    arrows: true,
  };

  return (
    <Slider_Containers>
      <Slider {...settings}>
        <div>
          <LandingBackgroundImg>
            <Text_Containers>
              <Text_Header>이미지 = 프로젝트 </Text_Header>
              <Text>프로젝트 진척도에 따라 퍼즐이미지가 완성됩니다</Text>
              <Text>프로젝트별, 스프린트 별로 상징하는 이미지를 생성하세요</Text>
              <Text>이미지가 프로젝트 진척도에 따라 퍼즐처럼 맞춰집니다</Text>
              <Text>프로젝트 진척도를 쉽고 재미있게 파악할 수 있습니다</Text>
            </Text_Containers>
          </LandingBackgroundImg>
        </div>
        <div>
          <LandingBackgroundImg2>
          <Text_Containers>
            <Text_Header>퍼즐 조각 = 업무카드</Text_Header>
            <Text>할일을 업무카드로 작성해보세요</Text>
            <Text>업무카드 하나를 완료하면 퍼즐이 맞춰집니다</Text>
          </Text_Containers>
          </LandingBackgroundImg2>
        </div>
        <div>
          <LandingBackgroundImg3>
          <Text_Containers>
              <Text_Header>캘린더 = 업무기록</Text_Header>
              <Text>캘린더를 통해 팀원 전체의 업무기록을 확인해보세요</Text>
              <Text>요일별로 정리된 업무기록을 확인할 수 있습니다</Text>
              <Text>정리된 업무기록을 공유해보세요</Text>
            </Text_Containers>
          </LandingBackgroundImg3>
        </div>
        {/* <div>
          <LandingBackgroundImg4>
          </LandingBackgroundImg4>
        </div> */}
      </Slider>
      <Slider_Layout_Containers>
        <Guestbtn onClick={experience}>체험하기</Guestbtn>
        {signUp ? (
          <Login setSignUp={setSignUp} />
        ) : (
            <SignUp setSignUp={setSignUp} />
          )}
      </Slider_Layout_Containers>
    </Slider_Containers>
  )
}

export default Landing

// <------------ Common ------------> //

const Slider_Containers = styled.div`
  .slick-prev{
    color: red;
    left: 30px;
    z-index: 1;
  }

  .slick-prev:before{
    font-size: 50px;
    opacity: 1;
  }

  .slick-next{
    color: red;
    right: 60px;
    z-index: 1;
  }

  .slick-next:before{
    font-size: 50px;
    opacity: 1;
  }

  .slick-dots{
    bottom: 50px;
  }

  .slick-dots li.slick-active button:before{
    color:white;
  }

  .slick-dots li button:before{
    color:white;
  }

  .slick-slider{
    position: relative
  }
`

const Text_Containers = styled.div`
  width: 80vw;
  height: 100vh;
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Text_Header = styled.div`
  color:black;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  font-size: 5em;
  margin-bottom: 100px;
  text-shadow: -2px 0 white, 0 2px white, 2px 0 white, 0 -2px white;
  -moz-text-shadow: -2px 0 #F2F1F6, 0 2px #F2F1F6, 2px 0 #F2F1F6, 0 -2px #F2F1F6;
  -webkit-text-shadow: -12px 0 #F2F1F6, 0 2px #F2F1F6, 2px 0 #F2F1F6, 0 -2px #F2F1F6;

`

const Text = styled.div`
color:white;
font-family: 'Roboto';
font-style: italic;
font-weight: 500;
font-size: 2em;
margin-bottom: 50px;
`

const Slider_Layout_Containers = styled.div`
position: absolute;
top: 0px;
width: 100%;
height: 80%;
`

const Guestbtn = styled.button`
  width: 130px;
  height: 60px;
  border-radius: 15px;
  color: white;
  background-color: #fa991d;
  cursor: pointer;
  outline: none;
  border: none;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 1em;
  margin: 30px; 0px; 0px; 30px;

  &:hover {
    color: #111;
}
`

const LandingBackgroundImg = styled.div`
  width:100vw;
  height:100vh;
  background: linear-gradient(
    270deg,
    #000000 5.77%,
    rgba(255, 255, 255, 0) 99.13%
  ),url(${BackImg1});
  background-size: cover;
  display:flex;
`

const LandingBackgroundImg2 = styled.div`
width:100vw;
height:100vh;
background: linear-gradient(
  270deg,
  #000000 5.77%,
  rgba(255, 255, 255, 0) 99.13%
),url(${BackImg2});
background-size: cover;
display:flex;
`

const LandingBackgroundImg3 = styled.div`
width:100vw;
height:100vh;
background: linear-gradient(
  270deg,
  #000000 5.77%,
  rgba(255, 255, 255, 0) 99.13%
),url(${BackImg3});
background-size: cover;
display:flex;
`

const LandingBackgroundImg4 = styled.div`
width:100vw;
height:100vh;
background: linear-gradient(
  270deg,
  #000000 5.77%,
  rgba(255, 255, 255, 0) 99.13%
),url(${BackImg4});
background-size: cover;
display:flex;
`

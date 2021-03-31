import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { useHistory } from 'react-router-dom'

import { FindEamilModal } from '../user/FindEmailModal'
import { FindPwModal } from '../user/FindPwModal'

import LoginError from './LoginError'

import logo from '../Img/Puzzle_Logo_ Square.png'

export const Login = ({ setSignUp }) => {
  const history = useHistory()

  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPwModal, setShowPwModal] = useState(false)
  const [showLoginErrorModal, setShowLoginErrorModal] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onChange = e => {
    const {
      target: { name, value },
    } = e
    if (name === 'email') {
      setEmail(value)
    }
    if (name === 'password') {
      setPassword(value)
    }
  }

  const handleLogin = (event) => {
    axios
      .post('https://api.teampuzzle.ga:4000/user/login', {
        email,
        password,
      })
      .then(res => {
        event.preventDefault();
        sessionStorage.setItem('accessToken', res.data.accessToken)
        history.push('/home')
        console.log('로그인 성공', sessionStorage)
      })
      .catch(err => {
        setShowLoginErrorModal(perv => !perv)
      })
  }

  const openEmailModal = () => {
    setShowEmailModal(perv => !perv)
  }

  const onSignUp = () => {
    setSignUp(prev => !prev)
  }

  const openPwModal = () => {
    setShowPwModal(perv => !perv)
  }

  return (
    <Login_Containers>
      <Login_Logo src={logo}></Login_Logo>
      <UserInfoInput
        onChange={onChange}
        name="email"
        type="email"
        placeholder="이메일"
      />
      <UserInfoInput
        onChange={onChange}
        name="password"
        type="password"
        placeholder="비밀번호"
      />
      <Loginbtn onClick={handleLogin}>로그인</Loginbtn>
      <FindUserInfobtn onClick={openEmailModal}>이메일 찾기</FindUserInfobtn>
      <FindUserInfobtn onClick={openPwModal}>비밀번호 찾기</FindUserInfobtn>
      <SignUpbtn onClick={onSignUp}>회원가입</SignUpbtn>
      <FindEamilModal
        showEmailModal={showEmailModal}
        setShowEmailModal={setShowEmailModal}
      />
      <FindPwModal showPwModal={showPwModal} setShowPwModal={setShowPwModal} />
      <LoginError
        showLoginErrorModal={showLoginErrorModal}
        setShowLoginErrorModal={setShowLoginErrorModal}
      ></LoginError>
    </Login_Containers>
  )
}

const Login_Containers = styled.div`
  position: fixed;
  top: -2em;
  right: 1em;
  height: 100%;
  width: 800px;
  margin-left:auto;
  display:flex;
  align-items: center;
  flex-direction: column;
  float: right;
  width: 30em;
`

const Login_Logo = styled.img`
  width: 80px;
  height: 80px;
  margin: 150px 0px 300px 0px;
`

const UserInfoInput = styled.input`
  background-color: transparent;
  border: transparent;
  border-bottom: 3px solid #ef4d70;
  padding-bottom: 10px;
  color: white;
  width: 10vw;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: white;
  }
  font-size: 1.1rem;
  margin-bottom: 50px;
`

const Loginbtn = styled.button`
  border-radius: 8px;
  color: white;
  width: 12vw;
  background-color: #FA991D;
  cursor: pointer;
  outline: none;
  font-size: 1.5rem;
  border: none;

  &:hover {
    color: #111;
}
margin-bottom: 20px;
`

const FindUserInfobtn = styled.button`
  border-radius: 8px;
  color: white;
  width: 12vw;
  height: 4vh;
  background-color: #1c7690;
  cursor: pointer;
  border: none;
  font-size: 1.1rem;
  outline: none;

  &:hover {
    color: #111;
}
margin-bottom: 20px;
`
const SignUpbtn = styled.button`
  border-radius: 8px;
  color: white;
  width: 12vw;
  height: 4vh;
  background-color: gray;
  cursor: pointer;
  border: none;
  font-size: 1.1rem;
  outline: none;

  &:hover {
    color: #111;
}
`

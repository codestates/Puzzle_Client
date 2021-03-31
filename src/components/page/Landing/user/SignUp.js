import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import logo from '../Img/Puzzle_Logo_ Square.png'

export const SignUp = ({ setSignUp }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const onSignUp = () => {
    setSignUp(prev => !prev)
  }

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
    if (name === 'passwordConfirm') {
      setConfirmPassword(value)
    }
    if (name === 'name') {
      setName(value)
    }
    if (name === 'tel') {
      setPhone(value)
    }
  }

  const handleSignup = e => {
    axios
      .post(
        'https://api.teampuzzle.ga:4000/user/signup',
        {
          email,
          password,
          name,
          phone,
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      )
      .then(res => {
        alert('회원가입이 완료되었습니다.')
        setSignUp(prev => !prev)
      })
      .catch(err => {
        if (err.response.status === 409) {
          //setError('모든 항목은 필수입니다.')
          alert('동일한 이메일이 존재합니다.')
        }
        if (err.response.status === 404) {
          alert('모든 항목은 필수입니다.')
        }
        console.log('에러')
      })
  }
  // 항목이 하나라도 안들어오면 로그인 안되는거 해주세요

  return (
    <>
    <SignUp_Containers>
      <Login_Logo src={logo}></Login_Logo>
      <UserSignUpBox>
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
        {/* <UserInfoInput
          onChange={onChange}
          name="passwordConfirm"
          type="password"
          placeholder="Confirm Password"
        /> */}
        <UserInfoInput
          onChange={onChange}
          name="name"
          type="text"
          placeholder="닉네임"
        />
        <UserInfoInput
          onChange={onChange}
          name="tel"
          type="tel"
          placeholder="휴대전화 번호"
        />
      </UserSignUpBox>
      <SignUpBox>
        <SignUpbtn onClick={handleSignup}>회원가입</SignUpbtn>
        <Loginbtn onClick={onSignUp}>뒤로가기</Loginbtn>
      </SignUpBox>
    </SignUp_Containers>
    </>
  )
}

const SignUp_Containers = styled.div`
  position: fixed;
  top: 8em;
  right: -2.5em;
  width: 30em;

  height: 100%;
  width: 800px;
  margin-left:auto;
  display:flex;
  align-items: center;
  flex-direction: column;
  float: right;
`

const Login_Logo = styled.img`
  position: absolute;
  top: -10em;
  right: 16em;
  width: 80px;
  height: 80px;
  margin: 150px 0px 300px 0px;
`

const UserSignUpBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  right: 10vw;
  top: 40vh;
  height: 18vh;
  background-color: transparent;
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
`
const SignUpBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  justify-content: space-between;
  align-items: center;
  color: white;
  right: 10vw;
  top: 62vh;
  height: 10vh;
  width: 10vw;
  background-color: transparent;
`

const SignUpbtn = styled.button`
  border-radius: 8px;
  color: white;
  width: 12vw;
  height: 4vh;
  background-color: #FA991D;
  cursor: pointer;
  outline: none;
  font-size: 1.1rem;
  border: none;

  &:hover {
    color: #111;
}
`

const Loginbtn = styled.button`
  border-radius: 8px;
  color: white;
  width: 12vw;
  height: 4vh;
  background-color: gray;
  cursor: pointer;
  outline: none;
  font-size: 1.1rem;
  border: none;

  &:hover {
    color: #111;
}
`

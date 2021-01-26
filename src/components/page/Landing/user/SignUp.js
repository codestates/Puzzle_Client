import React, { useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'

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
      })
  }
  // 항목이 하나라도 안들어오면 로그인 안되는거 해주세요

  return (
    <>
      <UserSignUpBox>
        <UserInfoInput
          onChange={onChange}
          name="email"
          type="email"
          placeholder="Email"
        />
        <UserInfoInput
          onChange={onChange}
          name="password"
          type="password"
          placeholder="Password"
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
          placeholder="Name"
        />
        <UserInfoInput
          onChange={onChange}
          name="tel"
          type="tel"
          placeholder="Phone"
        />
      </UserSignUpBox>
      <SignUpBox>
        <SignUpbtn onClick={handleSignup}>Sign Up</SignUpbtn>
        <Loginbtn onClick={onSignUp}>Login</Loginbtn>
      </SignUpBox>
    </>
  )
}

const UserSignUpBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  color: balck;
  width: 12vw;
  height: 4vh;
  background-color: white;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
  font-size: 1.1rem;
`

const Loginbtn = styled.button`
  border-radius: 8px;
  color: white;
  width: 12vw;
  height: 4vh;
  background-color: #afafaf;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
  font-size: 1.1rem;
`
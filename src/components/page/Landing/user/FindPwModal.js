import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'
import { MdClose } from 'react-icons/md'
import axios from 'axios'

import Logo_S from '../Img/Puzzle_Logo_ Square.png'

import PasswrodChangeSuccess from './PwChangeSuccess'

export const FindPwModal = ({ showPwModal, setShowPwModal }) => {
  const modalRef = useRef()
  const [find, setFind] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [errortext, setErrorText] = useState('')
  const [error, setError] = useState(false)
  const [verifyPwBoolean, setverifyPwBoolean] = useState(false);
  const [changePw, setchangePw] = useState('');
  const [changeVerify,setchangeVerify] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showPasswrodChangeSuccess, setShowPasswrodChangeSuccess] = useState(false);

  const onFind = e => {
    setFind(false);
    setError(false)
    e.preventDefault()
  }

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showPwModal ? 1 : 0,
    transform: showPwModal ? `translateY(0%)` : `translateY(-100%)`,
  })

  const closeEvent = () => {
    setName('');
    setPhone('');
    setEmail('');
    setError(false);
    setFind(false);
    setchangePw('')
    setchangeVerify('')
    setShowPwModal(false)
  }

  const closeModal = e => {
    if (modalRef.current === e.target) {
      setName('');
      setPhone('');
      setEmail('');
      setError(false);
      setFind(false);
      setchangePw('')
      setchangeVerify('')
      setShowPwModal(false)
    }
  }

  const keyPress = useCallback(
    e => {
      if (e.key === 'Escape' && showPwModal) {
        setName('');
        setPhone('');
        setEmail('');
        setError(false);
        setFind(false);
        setchangePw('')
        setchangeVerify('')
        setShowPwModal(false)
      }
    },
    [setShowPwModal, showPwModal]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyPress)
    return () => document.removeEventListener('keydown', keyPress)
  }, [keyPress])

  const onSubmit = async e => {
    e.preventDefault()
  }

  const onChange = e => {
    const {
      target: { name, value },
    } = e
    if (name === 'name') {
      setName(value)
    }
    if (name === 'email') {
      setEmail(value)
    }
    if (name === 'tel') {
      setPhone(value)
    }
  }

  const onChangePasswordChange = e => {
    const {
        target: { name, value },
    } = e
    if (name === 'passwordChange') {
        setchangePw(value)
        if(changeVerify < 1 || value < 1){
            setverifyPwBoolean(false)
        } else if(changeVerify === value){
            setverifyPwBoolean(false)
        } else if(changeVerify !== value){
            setverifyPwBoolean(true)
        }
    }
}

  const PasswordVerify = (e) => {
    setchangeVerify(e.target.value)
    if (changePw < 1 || e.target.value < 1) {
        setverifyPwBoolean(false)
    } else if (changePw === e.target.value) {
        setverifyPwBoolean(false)
    } else if (e.target.value !== changePw) {
        setverifyPwBoolean(true)
    }
}


  const findPw = e => {
    axios
      .post('https://api.teampuzzle.ga:4000/user/findpw', {
        name,
        phone,
        email
      })
      .then(res => {
        e.preventDefault();
        setFind(true);
      })
      .catch(err => {
        e.preventDefault()
        setErrorText('입력하신 정보가 올바르지 않습니다.')
        setError(true);
      })
  }

  const changepw = e => {
    axios
    .post('https://api.teampuzzle.ga:4000/user/findpw', {
      changePw,
      name,
      phone,
      email
    })
    .then(res => {
      e.preventDefault();
      setFind(false);
      setName('');
      setPhone('');
      setEmail('');
      setchangePw('')
      setchangeVerify('')
      setShowPasswrodChangeSuccess(true)
    })
    .catch(err => {
      e.preventDefault()
    })
  }

  useEffect(() => {
    if(changePw === '' || changeVerify === '' || verifyPwBoolean === true){
        setBtnDisabled(true)
    } else{
        setBtnDisabled(false)
    }
})

  return (
    <>
      {showPwModal ? (
        <>
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={animation}>
            <ModalWrapper showPwModal={showPwModal}>
              <EmailP>비밀번호 찾기</EmailP>
              <Logo src={Logo_S} />
              {find ? (
                <>
                  <UserInfoBox>
                    <UserInfoInput 
                    type="text" 
                    placeholder="변경할 비밀번호 입력" 
                    name="passwordChange" 
                    onChange={onChangePasswordChange}
                    />
                    <UserInfoInput
                      onChange={PasswordVerify}
                      type="text"
                      placeholder="변경할 비밀번호 재입력"
                    />
                  <Passwrod_Change_verify verifyPwBoolean={verifyPwBoolean}>비밀번호가 일치하지 않습니다.</Passwrod_Change_verify>
                  </UserInfoBox>
                  <ChangePw onClick={changepw} disabled={btnDisabled}>변경</ChangePw>
                </>
              ) : (
                  <>
                    {error ? (
                      <>
                      <ErrorText_Containers>
                      <ErrorText>{errortext}</ErrorText>
                      </ErrorText_Containers>
                      <Backbtn onClick={onFind}>뒤로가기</Backbtn>
                      </>
                    ) : (
                        <ErrorText>
                          <UserInfoBox>
                            <UserInfoInput
                              onChange={onChange}
                              name="name"
                              type="text"
                              placeholder="닉네임"
                            />
                            <UserInfoInput
                              onChange={onChange}
                              name="email"
                              type="email"
                              placeholder="이메일"
                            />
                            <UserInfoInput
                              onChange={onChange}
                              name="tel"
                              type="text"
                              placeholder="휴대전화 번호"
                            />
                          </UserInfoBox>
                          <Findbtn onClick={findPw}>찾기</Findbtn>
                        </ErrorText>
                      )
                    }
                  </>
                )}
              <CloseModalButton
                aria-label="Close modal"
                onClick={() => closeEvent()}
              />
            </ModalWrapper>
          </animated.div>
        </Background>
              <PasswrodChangeSuccess
              showPasswrodChangeSuccess={showPasswrodChangeSuccess}
              setShowPasswrodChangeSuccess={setShowPasswrodChangeSuccess}
              setShowPwModal={setShowPwModal}
              ></PasswrodChangeSuccess>
              </>
      ) : null}
    </>
  )
}

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 70%;
`

const Passwrod_Change_verify = styled.div`
    margin-top: -30px;
    margin-left: 7px;
    color: red;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    visibility: ${props => props.verifyPwBoolean === true ? 'visible ' : 'hidden'}
`

const ModalWrapper = styled.div`
  width: 800px;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #141414;
  position: relative;
  z-index: 10;
  border-radius: 10px;
}
`

const ErrorText = styled.div`
  padding-bottom: 10px;
  margin-bottom: 40px;
  color: white;
  width: 100%;

  font-size: 1.1rem;
`

const ErrorText_Containers = styled.div`
  position: absolute;
  top: 160px;
  left: 400px;
  display: flex;
  flex-direction: column;
`

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
  color: white;
`
const UserInfoInput = styled.input`
  background-color: transparent;
  border: transparent;
  border-bottom: 3px solid #ef4d70;
  padding-bottom: 10px;
  margin-bottom: 40px;
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


const EmailP = styled.div`
  font-size: 2rem;
  color: white;
  padding: 40px;
`

const UserInfoBox = styled.div`
  position: absolute;
  top: 160px;
  left: 400px;
  display: flex;
  flex-direction: column;
  width: 300px;
`

const Findbtn = styled.button`
  position: absolute;
  top: 400px;
  left: 400px;
  border-radius: 8px;
  width: 200px;
  height: 50px;
  background-color: #FA991D;
  cursor: pointer;
  color: white;
  outline: none;
  border: none;
  font-size: 1.1rem;
  &:hover {
    color: #111;
}
`

const ChangePw = styled.button`
  position: absolute;
  top: 400px;
  left: 400px;
  border-radius: 8px;
  width: 200px;
  height: 50px;
  background-color: #FA991D;
  cursor: pointer;
  color: white;
  outline: none;
  border: none;
  font-size: 1.1rem;
  &:hover {
    color: #111;
}

  &:disabled {
    background-color:#E5E5E5;
    cursor: not-allowed;
    color:gray;
}
`

const Backbtn = styled.button`
  position: absolute;
  top: 400px;
  left: 400px;
  border-radius: 8px;
  width: 200px;
  height: 50px;
  background-color: gray;
  outline: none;
  border: none;
  color:white;
  cursor: pointer;
  &:hover {
    color: #111;
  }
  font-size: 1.1rem;
`

const Logo = styled.img`
  width: 250px;
  margin-left: 50px;
`

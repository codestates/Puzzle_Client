import React, { useRef, useEffect, useCallback, useState } from 'react'
import axios from 'axios';
import styled from 'styled-components'

import { Close } from '@styled-icons/evaicons-solid/Close'

import PasswrodChangeSuccess from './PasswrodChangeSuccess'
import PasswordChangeFail from './PasswordChangeFail'

const PasswordChange = ({ showPasswrodChange, setShowPasswrodChange }) => {
    const modalRef = useRef()

    const accessToken = sessionStorage.getItem("accessToken");

    const [showPasswrodChangeSuccess, setShowPasswrodChangeSuccess] = useState(false);
    const [password, setpassword] = useState('');
    const [changePw, setchangePw] = useState('');
    const [changeVerify,setchangeVerify] = useState('');
    const [verifyPwBoolean, setverifyPwBoolean] = useState(false);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [showPasswrodChangeFail,setShowPasswrodChangeFail] = useState(false);

    const postPasswordChange = () => {
        axios
            .post('https://api.teampuzzle.ga:4000/user/useredit', {
                password,
                changePw
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                setShowPasswrodChangeSuccess(perv => !perv)
            })
            .catch(err =>{
                setShowPasswrodChangeFail(perv => !perv)
            })
    }

    const onChangePasswordChange = e => {
        const {
            target: { name, value },
        } = e
        if (name === 'password') {
            setpassword(value)
        }
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

    // const openPasswrodChangeSuccess = () => {
    //     setShowPasswrodChangeSuccess(perv => !perv)
    // }

    const closeModal = e => {
        if (modalRef.current === e.target) {
            setShowPasswrodChange(false)
        }
    }

    const onSubmit = async e => {
        e.preventDefault()
    } //새로고침 방지

    useEffect(() => {
        if(password === '' || changePw === '' || changeVerify === '' || verifyPwBoolean === true){
            setBtnDisabled(true)
        } else{
            setBtnDisabled(false)
        }
    })

    return (
        <>
            {showPasswrodChange ? (
                <>
                    <Background onClick={closeModal} ref={modalRef}>
                        <ModalWrapper showPasswrodChange={showPasswrodChange}>
                            <Password_Header_Containers>
                                <Password_Header_Title>비밀번호 변경</Password_Header_Title>
                                <CloseModalButton
                                    onClick={() => setShowPasswrodChange(prev => !prev)}
                                ></CloseModalButton>
                            </Password_Header_Containers>
                            <Password_Change_Containers>
                                <form onSubmit={onSubmit}>
                                    <Password_Change_Inside_Containers>
                                        <Password_Context_Text >현재 비밀번호</Password_Context_Text>
                                        <Password_Input placeholder=" 현재 비밀번호를 입력해주세요." name="password" onChange={onChangePasswordChange}></Password_Input>
                                        <Password_Context_Text >변경 할 비밀번호</Password_Context_Text>
                                        <Password_Input placeholder=" 변경할 비밀번호를 입력해주세요." name="passwordChange" onChange={onChangePasswordChange}></Password_Input>
                                        <Password_Context_Text >변경 할 비밀번호 확인</Password_Context_Text>
                                        <Password_Input placeholder=" 변경할 비밀번호를 한 번 더 입력해주세요." name="passwordChangeVerify" onChange={PasswordVerify}></Password_Input>
                                        <Passwrod_Change_verify verifyPwBoolean={verifyPwBoolean}>비밀번호가 일치하지 않습니다.</Passwrod_Change_verify>
                                    </Password_Change_Inside_Containers>
                                </form>
                            </Password_Change_Containers>
                            <Passwrod_Change_btn_Containers>
                                <Passwrod_Change_btn onClick={postPasswordChange} disabled={btnDisabled}>변경하기</Passwrod_Change_btn>
                            </Passwrod_Change_btn_Containers>
                        </ModalWrapper>
                    </Background>
                    <PasswrodChangeSuccess
                        showPasswrodChangeSuccess={showPasswrodChangeSuccess}
                        setShowPasswrodChangeSuccess={setShowPasswrodChangeSuccess}
                        setShowPasswrodChange={setShowPasswrodChange}
                    ></PasswrodChangeSuccess>
                    <PasswordChangeFail
                        showPasswrodChangeFail={showPasswrodChangeFail}
                        setShowPasswrodChangeFail={setShowPasswrodChangeFail}
                    ></PasswordChangeFail>
                </>
            ) : null}
        </>
    )
}

export default PasswordChange;

// <------------ css ------------> //

const Background = styled.div`
    width: 25rem;
    height: 2rem;
    position: fixed;
    top: 50%;
    right: 50%;
    transform: translate(80%);
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    z-index: 5;
`

const ModalWrapper = styled.div`
    width: 600px;
    height: 400px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: rgba(5, 36, 57, 0.97);
    color: #000;
    position: relative;
    right: 8rem;
    border: 1px black grey;
    border-radius: 10px;
`

const Password_Header_Containers = styled.div`
    display: flex;
    width:100%;
    height:60px;
    justify-content: center;
    align-items: center;
`

const Password_Header_Title = styled.div`
    margin-left: 220px;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 1.3em;
    color: white;
    width: 8rem;
`

const CloseModalButton = styled(Close)`
    cursor: pointer;
    width: 32px;
    height: 32px;
    z-index: 10;
    color:white;
    margin: 0 0 0 180px;
    &:hover{ color: #FA991D};
`
const Password_Change_Containers = styled.div`
    display:flex;
    width:100%;
    height:280px;
    justify-content: center;
`

const Password_Change_Inside_Containers = styled.div`
    display:flex;
    flex-direction:column;
    width: 300px;
    height: 100%;
    justify-content: center;
`

const Password_Context_Text = styled.strong`
    margin-bottom: 15px;
    margin-left: 5px;
    color: white;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 1.2em;
`

const Password_Input = styled.input.attrs({
    type: "password"
})`
    width:300px;
    height:20px;
    outline: none;
    border:none;
    border-bottom: 2px solid #FA991D;
    background-color: transparent;
    color: white;
    margin-bottom: 15px;

    &::placeholder {
        color: #ddd;
    }
`

const Passwrod_Change_btn_Containers = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
`

const Passwrod_Change_btn = styled.button`
    width: 150px;
    height: 30px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    font-size: 1em;
    color: white;
    outline: none;
    background-color:#FA991D;

    &:hover {
        color: #111;
    }

    &:disabled {
        background-color:#E5E5E5;
        cursor: not-allowed;
        color:black;
    }
`

const Passwrod_Change_verify = styled.div`
    margin-top: -7px;
    margin-left: 7px;
    color: red;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 500;
    visibility: ${props => props.verifyPwBoolean === true ? 'visible ' : 'hidden'}
`
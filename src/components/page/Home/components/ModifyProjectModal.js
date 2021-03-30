import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'
import Img from '../../../../images/icon/img.jpg'
import { MdClose } from 'react-icons/md'
import axios from 'axios'

export const ModifyProjectModal = ({ showModifyProject, setShowModifyProject, projectId, projectImage }) => {
  const modalRef = useRef()
  const [usercode, setUsercode] = useState('')
  const [projectInfo, setProjectInfo] = useState({
    description: '',
    title: '',
    usercode: [],
    imageUrl: '',
    coordinates: ''
  })//coordinates 기본값
  const accessToken = sessionStorage.getItem('accessToken')

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showModifyProject ? 1 : 0,
    transform: showModifyProject ? `translateY(0%)` : `translateY(-100%)`,
  })

  const closeModal = e => {
    if (modalRef.current === e.target) {
      setShowModifyProject(false)
    }
  }

  const keyPress = useCallback(
    e => {
      if (e.key === 'Escape' && showModifyProject) {
        setShowModifyProject(false)
      }
    },
    [setShowModifyProject, showModifyProject]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyPress)
    return () => document.removeEventListener('keydown', keyPress)
  }, [keyPress])

  const onChange = e => {
    const { target: { name, value }, } = e
    if (name === 'name') {
      setProjectInfo({...projectInfo, title: value})
      console.log(projectInfo.title)
    }
    if (name === 'project') {
      setProjectInfo({...projectInfo, description: value})
      console.log(projectInfo.description)
    }
    if (name === 'usercode') {
      setProjectInfo({...projectInfo, usercode: projectInfo.usercode.concat(value)})
      console.log(projectInfo.usercode)
    }
  }

  const onChangeMember = (e) => {
    setUsercode(e.target.value);
    console.log(usercode);
  }

  const handleMember = () => {
    const newUserCode = usercode;
    const users = projectInfo.usercode;
    for (let i=0; i<users.length; i++) {
      if (usercode === users[i]) {
        alert('이미 등록한 유저코드입니다.');
        return;
      }
    }
    setProjectInfo({
      ...projectInfo,
      usercode: projectInfo.usercode.concat(newUserCode)
    });
    setUsercode('');
    console.log(projectInfo.usercode)
  }

  const handleDeleteMember = (user) => {
    const userCodes = projectInfo.usercode;
    for (let i=0; i<userCodes.length; i++) {
      if (user === userCodes[i]) {
        userCodes.splice(i, 1);
        setProjectInfo({
          ...projectInfo,
          usercode: userCodes
        })
      }
    }
  }

  const modifyProject = (projectInfo) => {
    console.log(projectInfo)
    //유효성 검사
    if (projectInfo.title.length === 0 || projectInfo.title.length > 30) {
      alert('프로젝트 이름을 입력하지 않았거나 너무 긴 이름입니다.');
      console.log('유효성검사 title')
      return;
    }
    if (projectInfo.description.length === 0 || projectInfo.description.length > 140) {
      alert('프로젝트 설명을 입력하지 않았거나 너무 깁니다.');
      console.log('유효성검사 desc')
      return;
    }
    if (projectInfo.imageUrl.length === 0) {
      alert('이미지를 등록해 주세요.')
      return;
    }
    axios.
      post(`https://api.teampuzzle.ga:4000/project/update/${projectId}`, 
        projectInfo, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'  
          }
        }
      )
      .then(res => {
        console.log(res);
        alert('프로젝트 업데이트 성공')
        setShowModifyProject(prev => !prev)
        window.location.reload();
      })
      .catch(err => console.log(err));
  }

  const UploadImg = (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    axios.post('https://api.teampuzzle.ga:4000/project/setpuzzle', formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      setProjectInfo({
        ...projectInfo,
        imageUrl: res.data.url
      })
      console.log(projectInfo)
    })
    .catch(err => console.err(err))
  }

  return (
    <>
      {showModifyProject ? (
        <Background onClick={closeModal} ref={modalRef}>

          <animated.div style={animation}>
            <ModalWrapper showModifyProject={showModifyProject}>
              <Title>프로젝트 수정</Title>
              <ImageContainer >
                <ProjectListImg src={projectInfo.imageUrl === '' ? projectImage : projectInfo.imageUrl}/>
                  <ImageLabel htmlFor="Project_Img_Select">
                    프로젝트 이미지 업로드
                  </ImageLabel>
                  <UploadProjectImg type="file" name="image" id="Project_Img_Select" accept="image/jpg,impge/png,image/jpeg,image/gif" onChange={UploadImg}></UploadProjectImg>
              </ImageContainer>
              <InputContainer>
                <ProjectInfoBox>
                  <ProjectInfo
                    onChange={onChange}
                    name="name"
                    type="text"
                    placeholder="프로젝트 이름(1~30자)"
                  />
                  <ProjectInfo
                    onChange={onChange}
                    name="project"
                    type="text"
                    placeholder="프로젝트 내용(1~140자)"
                  />
                </ProjectInfoBox>

                <AddMemberContainer>
                  <AddMemberInfo
                    onChange={onChangeMember}
                    name="usercode"
                    type="text"
                    placeholder="Usercode를 입력해주세요(8자) "
                    value={usercode}
                  />
                  <AddMemberbtn onClick={handleMember} >멤버 추가</AddMemberbtn>
                </AddMemberContainer>
              </InputContainer>
            
              
              <CurrMemBox>
                {projectInfo.usercode.map((user, idx) => {
                  return (
                    <CurrMemContainer key={idx}>
                      <CurrMem>{user}</CurrMem>
                      <CurrMemDeleteBtn onClick={() => {handleDeleteMember(user)}} >삭제</CurrMemDeleteBtn>
                    </CurrMemContainer>
                  )
                })}
              </CurrMemBox>

              <CloseModalButton
                aria-label="Close modal"
                onClick={() => {
                  console.log('close modal')
                  setShowModifyProject(prev => !prev)
                  setProjectInfo({
                    description: '',
                    title: '',
                    usercode: [],
                    imageUrl: '',
                    coordinates: ''                
                  })
                }}
              />
            </ModalWrapper>
          </animated.div>
          <CreateProjectbtn onClick={() => {modifyProject(projectInfo)}}>프로젝트 수정</CreateProjectbtn>
        </Background>
      ) : null}
    </>
  )
}

const Background = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  position: fixed;
  left: 30%;
  top: 15%;
  
`

const ModalWrapper = styled.div`
  width: 800px;
  height: 700px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: rgba(25, 50, 77, 0.9);
  position: relative;
  border-radius: 10px;
`

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 60%;
  height: 30%;
  position: relative;
  bottom: 2em;
  margin: 2rem auto;
`

const CloseModalButton = styled(MdClose)`
  display; block;
  cursor: pointer;
  position: relative;
  bottom: 38rem;
  left: 47rem;
  width: 32px;
  height: 32px;
  color: white;
  /* border: 1px solid red; */
`

const Project_Img_Select = styled.button`
  text-align: center;
`

const UploadProjectImg = styled.input`
  width: 1px; 
  height: 1px; 
  padding: 0; 
  margin: -1px; 
  overflow: hidden;
  clip:rect(0,0,0,0);
  border: 0;

`

const ImageContainer = styled.div`

`

const ImageLabel = styled.label`
  display: block;
  width: 13em;
  text-align: center;
  margin: 1em auto 0; 
  color: #999; 
  font-size: inherit; 
  line-height: normal; 
  vertical-align: middle; 
  background-color: #fdfdfd; 
  cursor: pointer; 
  border: 0px solid #ebebeb; 
  border-bottom-color: #e2e2e2; 
  border-radius: .25em;

`

const Title = styled.div`
  font-size: 2rem;
  color: white;
  text-align: center;
  padding-top: 20px;
  padding-bottom: 40px;
  margin: 0 auto;
`
const ProjectListImg = styled.img`
  display: block;
  background-image: url(${Img});
  width: 13em;
  height: 13em;
  border-radius: 5%;
  background-size: cover;
  background-color: white;
  margin: 0 auto;
  border: 0px solid black;
`
const StyledAlwaysScrollSection = styled.div`
  overflow: scroll;
  &::-webkit-scrollbar {
    /* 세로 스크롤 넓이 */
    width: 8px;

    /* 가로 스크롤 높이 */
    height: 8px;

    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
`
const ProjectInfo = styled.input`
  background-color: transparent;
  border: transparent;
  border-bottom: 3px solid #afafaf;
  padding-bottom: 10px;
  color: white;
  width: 15vw;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #afafaf;
    text-align: center
  }
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1rem;
`
const AddMemberInfo = styled.input`
  background-color: transparent;
  border: transparent;
  border-bottom: 3px solid #afafaf;
  padding-bottom: 10px;
  color: white;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #afafaf;
  }
  font-size: 0.9rem;
  position: relative;
  top: 6.5em;
  left: 6.5em;
  height: 1.3rem;
  width: 12vw;
  /* border: blue solid 1px; */
  overflow: hidden;

`

const AddMemberContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;

`
const ProjectInfoBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  background-color: transparent;
`
const AddMemberbtn = styled.button`
  margin-top: 1rem;
  width: 60px;
  height: 25px;
  color: white;
  background-color: #afafaf;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  font-size: 0.7rem;
  position: relative;
  right: -9em;
  top: 7.5em;

  &:active,
  &:focus {
    outline: none;
  }
`

const CreateProjectbtn = styled.button`
  width: 260px;
  height: 30px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  font-size: 1em;
  color: #111;
  outline: none;
  background-color: #fa991d;
  position: absolute;
  right: 33%;
  bottom: 20px;
  display: block;
  &:hover {
    color: white;
  }
`
const CreateProjectbtnBox = styled.div`
  height: 500px;
  margin-bottom: 1rem;
`

const CurrMem = styled.div`
  font-size: 1em;
  color: white;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
  margin: 0 auto;
  border-top: 3px solid #fa991d;
  
`
const CurrMemDeleteBtn = styled.button`
  background: rgba(0, 0, 0, 0);
  border: none;
  color: grey;
  font-style: italic;
  cursor: pointer;
  &:focus {
    outline: none;
  }

`
const CurrMemContainer = styled.div`
  display: flex;
`

const CurrMemBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  left: 36%;
  top: 30em;
  height: 16%;
  width: 30%;
  margin-top: 1rem;
  /* border: 1px grey solid; */
  overflow-y: auto;
  overflow-x: hidden;


  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: black;
  }

  &::-webkit-scrollbar-track {
    background-color: grey;
  }
`



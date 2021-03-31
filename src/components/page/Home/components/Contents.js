import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { BiSearch } from 'react-icons/bi'
import axios from 'axios'
import arrow from '../../../../images/icon/icon-forward copy.svg'
import backToHome from '../../../../images/icon/icon-backward.svg'

import { NewProjectModal } from './NewProjectModal'
import { ModifyProjectModal } from './ModifyProjectModal'

// import {useHistory} from 'react-router-dom'
const Contents = (props) => {
  const history = useHistory();
  const [showNewProject, setShowNewProject] = useState(false);
  const [showModifyProject, setShowModifyProject] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const [showHome, setShowHome] = useState(false)
  const [projectId, setProjectId] = useState();
  const [projectImage, setProjectImage] = useState('');
  const [searchProject, setSearchProject] = useState('');
  const [loginUserInfo, setLoginUserInfo] = useState({})
  const searchInput = useRef();
  const scroll = useRef();
  const accessToken = sessionStorage.getItem('accessToken')
  const openProjectModal = () => {
      setShowNewProject(prev => !prev)
  }

  const enterKey = () => {
    if (window.event.keyCode === 13) {
      findProject();
    }
  }

  const findProject = () => {
    axios
      .post('https://api.teampuzzle.ga:4000/home/search', {
        projectName: searchProject
        }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        let {projects} = res.data;
        console.log(projects)
        props.setProjectData(projects);
      })
      .catch(err => console.err(err))
    setSearchProject('');
    setShowHome(true);
  }

  const getProjectInfo = (projectId) => {
    axios
      .get(`https://api.teampuzzle.ga:4000/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log('프로젝트 정보요청', res.data);
        const projectInfo = res.data;
        const stringInfo = JSON.stringify(projectInfo);
        props.projectUp(res.data)
        sessionStorage.setItem('projectInfo', stringInfo);
      })
      .then(res => history.push("/project"))
  }

  const goToBottom = () => {
    scroll.current.scrollTop = scroll.current.scrollHeight - scroll.current.clientHeight;
    setShowArrow(false);
  }

  const handleScroll = () => {
    if(scroll.current.scrollTop < scroll.current.scrollHeight - scroll.current.clientHeight){
      setShowArrow(true);
    }else if (scroll.current.scrollTop = scroll.current.scrollHeight - scroll.current.clientHeight) {
      setShowArrow(false);
    }
  }

  const handleDeleteModal = (projectId, e) => {
    e.stopPropagation(); //버블링 방지
    setProjectId(projectId);
    setShowDeleteModal(prev => !prev);    
  }

  const modifyProject = (projectInfo, e) => {
    e.stopPropagation();
    setProjectId(projectInfo.id)
    setProjectImage(projectInfo.projectImg)
    setShowModifyProject(prev => !prev)
  }
  
  const deleteProject = () => {
    axios.delete(`https://api.teampuzzle.ga:4000/home/delete/${projectId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      window.location.reload();
    })
    .catch(err => console.log(err))
  }

  const refreshPage = () => {
    window.location.reload();
  }
  return (
    <>
      <Div className="row">
        <HomeNav>
          {showHome && <RefreshHome src={backToHome} onClick={refreshPage}/>}
          <SearchBarBox>
            <SearchBar
              type="text"
              placeholder="프로젝트 이름을 입력하세요."
              value={searchProject}
              onChange={e => {
                setSearchProject(e.target.value);
                console.log(searchProject);
              }}
              onKeyUp={enterKey}
              ref={searchInput}
            ></SearchBar>
            <SerachButton onClick={findProject}/>
          </SearchBarBox>
          <CreateBtn onClick={openProjectModal}>새 프로젝트</CreateBtn>

        </HomeNav>
        <ProjectDivContainer ref={scroll} onScroll={handleScroll}>
          {
            props.projectData.map(info => {
              console.log(info.usersData)
              return (
                <ProjectContainer key={info.id} onClick={() => getProjectInfo(info.id)}>
                  <Project >
                    <ProjectUser_Containers >
                      {
                        info.usersData.map(profile => {
                          return (
                            <ProjectUser_img src={profile.profileImg} key={profile.id} title={profile.name} alt={profile.name}/>
                          )
                        })
                      }
                    </ProjectUser_Containers>
                    <ProjectTitle>{info.title}</ProjectTitle>
                    <ProjectImg src={info.projectImg} />
                    <ProjectDesc>{info.description.length > 15 ? info.description.slice(0, 15) + '...': info.description}</ProjectDesc>
                    <ProjectDate>생성일: {info.createdAt.slice(0, 10)}</ProjectDate> {/* 날짜 표기 형식에 맞게 변경해야함 */}
                    <ButtonContainer>
                      <ModifyButton onClick={(e) => modifyProject(info, e)}>수정</ModifyButton>
                      {
                        info.usersData.length === 1 ?
                          <DeleteButton onClick={(e) => handleDeleteModal(info.id, e)}>삭제</DeleteButton> : null
                      }
                    </ButtonContainer>
                  </Project>
                </ProjectContainer>
              )
            })
          }
        </ProjectDivContainer>
      </Div>
      {showArrow && <BottomArrow src={arrow} onClick={goToBottom} />}

      <NewProjectModal  //프로젝트 생성용 모달
        showNewProject={showNewProject}
        setShowNewProject={setShowNewProject}
      />
      <ModifyProjectModal  //프로젝트 수정용 모달
        showModifyProject={showModifyProject}
        setShowModifyProject={setShowModifyProject}
        projectId={projectId}
        projectImage={projectImage}
      />
      {
        showDeleteModal ?
        <DeleteModal>
          <DeleteMainMessage>해당 프로젝트를 삭제하시겠습니까?</DeleteMainMessage>
          <DeleteSubMessage>삭제한 프로젝트는 다시 복구할 수 없습니다</DeleteSubMessage>
          <DeleteBtnContainer>
            <DeleteYesBtn onClick={deleteProject}>예</DeleteYesBtn>
            <DeleteNoBtn onClick={() => {setShowDeleteModal(prev => !prev)}}>아니오</DeleteNoBtn>
          </DeleteBtnContainer>
        </DeleteModal> : null
      }
    </>
  )
}

export default Contents

// <------------ css ------------> //

const Div = styled.div`
  position: relative;
  left: 1rem;
  background-color: rgb(25, 50, 77, 0.5);
  width: calc(100vw - 500px);
  height: 75vh;
  border: 0px solid black;
  border-radius: 16px;
  overflow-x: hidden;
  overflow-y: hidden;
  top: 1.5rem;
  /* border: 2px white solid; */
`
const ProjectDivContainer = styled.div`
  position: relative;
  top: 0em;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-content: left;
  width: 100%;
  height: 40.5em;
  margin-top: 2rem;
  box-sizing: border-box;
  padding: 0rem 3rem 3rem 0rem;
  /* border: 1px black solid; */
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  /* border: 2px solid white; */

`

const HomeNav = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
  width: 73vw;
  float: right;
  margin-right: 1rem;
  margin-top: 1rem;
`
const SearchBarBox = styled.span`
  background-color: #afafaf;
  border-radius: 50px;
  color: white;
  width: 12vw;
  display: flex;
  justify-content: space-around;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
`

const RefreshHome = styled.img`
  position: absolute;
  left: 1em;
  top: 0em;
  cursor: pointer;
`

const SearchBar = styled.input`
  border: transparent;
  background-color: transparent;
  width: 10vw;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #052439;
    text-align: left;
  }
  font-size: 14px;
  margin-left: 1rem;

`

const CreateBtn = styled.button`
  background: #565656;
  border-radius: 30px;
  width: 5vw;
  height: 41px;
  color: white;
  &:focus {
    outline: none;
  }
  cursor: pointer;
  border: transparent;
`
const ProjectContainer = styled.div`
  /* border: 3px solid #73AD21; */
  cursor: pointer;
  position: relative;
  left: 5em;
  display: flex;
  height: 20em;

  `

const Project = styled.span`
  border-radius: 13px;
  background-color: whitesmoke;
  background-size: cover;
  width: 18em;
  height: 17.5em;
  margin: 10px;
  position: reletive;
  cursor: pointer;
`
const ProjectImg = styled.img`
  display: block;
  position: static;
  width: 7vw;
  height: 6vw;
  border-radius: 10px;
  border: 2px solid #afafaf;
  background-size: cover;
  background-color: white;
  margin: 0px auto;
  margin-top: 15px;
  
`

const ProjectTitle = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
`

const ProjectDesc = styled.div`
  text-align: center;
  margin-top: 0.9rem;
  font-size: 1.1rem;
`

const ProjectDate = styled.div`
  text-align: left;
  margin-top: 1.1rem;
  margin-left: 1.5rem;
  font-size: 0.9rem;
  color: #afafaf;
`

const SerachButton = styled(BiSearch)`
  cursor: pointer;
  width: 25px;
  height: 25px;
  padding: 0;
  color: white;
  margin-right: 0.5rem;
`

const ProjectUser_Containers = styled.span`
  border-radius: 10px 10px 0px 0px;
  width: 100%;
  height: 35px;
  background-color: #3c556d;
  display: flex;
  justify-content: flex-end;
`

const ProjectUser_img = styled.img`
  width: 28px;
  height: 28px;
  object-fit: cover;
  background-color:blue;
  border-radius: 70%;
  margin-top: 3px;
  margin-left: 3px;
  margin-right: 5px;
`

const BottomArrow = styled.img`
  position: fixed;
  bottom: 10%;
  left: 52%;
  border: 0px solid white;
  transform: rotate(90deg);
  cursor: pointer;

`

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 11%;
  right: 5%;
  justify-content: flex-end;
`

const ModifyButton = styled.button`
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: black;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  /* 크기 */
  height: 1.25rem;
  font-size: 0.7rem;

  /* 색상 */
  background: whitesmoke;
  &:hover {
    background: grey;
  }
  &:active {
    background: #2b4257;
  }

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }

`

const DeleteButton = styled.button`
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: black;
  cursor: pointer;
  padding-left: 0.5rem;
  padding-right: 0.5rem;

  /* 크기 */
  height: 1.25rem;
  font-size: 0.7rem;

  /* 색상 */
  background: whitesmoke;
  &:hover {
    background: grey;
  }
  &:active {
    background: #2b4257;
  }

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`

const DeleteModal = styled.div`
  background-color: whitesmoke;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  padding: 1em;
  border-radius: 15px;
  box-shadow: 1px -1px 5px black;
`

const DeleteMessageContainer = styled.div`

`
const DeleteMainMessage = styled.div`
  font-size: 1.2em;
  margin-bottom: 0.3em;
`

const DeleteSubMessage = styled.div`
  font-style: italic;
  font-size: 1em;
  color: grey;

`

const DeleteBtnContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 1em 1em 0.5em;
`

const DeleteYesBtn = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2rem;
  font-size: 1.2rem;

  /* 색상 */
  background: #d96602;
  &:hover {
    background: #e69b5a;
  }
  &:active {
    background: #a36c3b;
  }

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }
`

const DeleteNoBtn = styled.button`
  /* 공통 스타일 */
  display: inline-flex;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;

  /* 크기 */
  height: 2rem;
  font-size: 1.2rem;

  /* 색상 */
  background: #3c556d;
  &:hover {
    background: #4978a3;
  }
  &:active {
    background: #2b4257;
  }

  /* 기타 */
  & + & {
    margin-left: 1rem;
  }

`
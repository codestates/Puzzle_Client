import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { PuzzleSet } from './PuzzleSet'
import PuzzleInfo from './PuzzleInfo'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Comment from './Comment'
import arrow from '../../../../images/icon/icon-forward.svg';



const ProjectContent = (props) => {
  /* props.projectInfo.project === refreshInfo.project */
  /* console.log(props.projectInfo.project.puzzlesInfo) */
  const [showPuzzleSet, setShowPuzzleSet] = useState(false);
  const [showArrow, setShowArrow] = useState(true);
  const scroll = useRef()
  const refreshInfo = JSON.parse(sessionStorage.getItem('projectInfo'))
  const isFinishProject = useRef()
  const [isFinishMessage, setIsFinishMessage] = useState(false)
  const [isProgress, setIsProgress] = useState(false)
  console.log(refreshInfo)

  const countFinished = () => {
    let result = 0;
    if (!props.projectInfo.project) {
      refreshInfo.project.puzzlesInfo.map(finished => {
        if (finished.isFinish === 1) {
          result++
        }
      })
    }else if (!refreshInfo) {

    }else {
      props.projectInfo.project.puzzlesInfo.map(finished => {
      if (finished.isFinish === 1) {
        result++;
      }
      })
    }
    return result;
  }

  const sumPuzzle = () => {
    if (!props.projectInfo.project) {
      return refreshInfo.project.puzzlesInfo.length;
    }else {
      return props.projectInfo.project.puzzlesInfo.length;
    }
  };

  const puzzleFinished = countFinished();
  const puzzleSum = sumPuzzle();
  const percent = parseInt(puzzleFinished / puzzleSum * 100); //작업진행 percent(==배열에서 제거돼야할 숫자요소의 개수)
  //몇 조각이 1퍼센트인지? 1퍼센트가 몇조각인지? 퍼즐 한개가 완료되면 몇 퍼센트 올라야 하는지
  const onePiecePercent = parseInt(1 / puzzleSum * 100);

  const indexGenerator = () => {
    const index = [];
    for (let i=1; i<=100; i++) {
      index.push(i);
    }
    return index;
  }

  /* const coordinates = [1, 2, 3, 6, 21, 35, 57 ]  ///mockUp data  */

  const fetchedCoordinates = refreshInfo.project.coordinates // "1,2,3,4,5," 문자열
  const stringCoordi = fetchedCoordinates.split(','); //stringCoordi: ["1", "2", "3"] string을 요소로 하는 배열 

  // convertToNumber: stringCoordinates를 입력받아 숫자를 요소로 가진 배열로 변환
  const convertToNumber = (stringArr) => {
    const result = [];
    for (let i=0; i<stringArr.length; i++) {
      result.push(Number(stringArr[i]))
    }
    return result;
  }  

  let coordinates = convertToNumber(stringCoordi) //배열 형태로 변환 

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
  useEffect(() => {
    if (refreshInfo.project.isFinish === 1) {
      isFinishProject.current.style.border = "5px #a1123d solid"
      setIsFinishMessage(true);
    }else{
      setIsFinishMessage(false)
    }
    if (!percent) {
      setIsProgress(false)
    }else {
      setIsProgress(true)
    }


  }, [])

  useEffect(() => {
    if (refreshInfo.project.isFinish === 1) {
      coordinates.pop();
      for (let i=1; i<101; i++) {
        const finishedGrid = document.getElementById(`puzzle${i}`);
        finishedGrid.style.zIndex = 1;
      }
    }else if (percent === 0) {
      //모든 퍼즐들의 isFinish가 0인지 확인(== percent가 0인지 확인)
      coordinates = indexGenerator();
    }else {
      for (let i=1; i<101; i++) {
        const reverseGrid = document.getElementById(`puzzle${i}`);
        reverseGrid.style.zIndex = 2;
        reverseGrid.style.background = "rgba(0,0,0,0)"
        reverseGrid.style.borderBottom = "0.1em solid #a2a9b3";
        reverseGrid.style.borderRight = "0.1em solid #a2a9b3";
        reverseGrid.style.borderTop = "0.1em solid #53585e";
        reverseGrid.style.borderLeft = "0.1em solid #53585e";
    }
    coordinates.forEach(coordinate => {
      const grid = document.getElementById(`puzzle${coordinate}`);
      if (grid) {
        grid.style.zIndex = 3;
        grid.style.backgroundColor = "#afafaf";
      } 
    })
    }

  })
  

  const settings = {
    dots: false,
    infinite: true,
    speed: 250,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  }

  const openPuzzleSet = () => {
    setShowPuzzleSet(prev => !prev)
  }
  

  return (
    <ProjectContent_Container ref={scroll} onScroll={handleScroll}>
        <Project_title>{!props.projectInfo.project ? refreshInfo.project.title : props.projectInfo.project.title}</Project_title>
      <ProjectPuzzleImgSection>
        {!isProgress ? <IsProgress>작업을 완료해 이미지조각을 맞춰 보세요</IsProgress> : null}
        <PuzzleBlock className="wrapper"> 
          {indexGenerator().map(piece => {
            return <PuzzleBlank className="blank" id={"puzzle"+piece} key={piece}> {/* {piece} */} </PuzzleBlank>
          })}
        </PuzzleBlock>
        <PuzzleImage src={!props.projectInfo.project ? refreshInfo.project.projectImg : props.projectInfo.project.projectImg} />
        <ProjectPuzzleSetbtn onClick={openPuzzleSet} >
          퍼즐 추가
        </ProjectPuzzleSetbtn>
      </ProjectPuzzleImgSection>
      <ProjectInfoContainer>
        <TextContainer>
          <ProjectForm>Description </ProjectForm>
          <ProjectForm>Progress </ProjectForm>
          <ProjectForm>Team Member </ProjectForm>
        </TextContainer>
        <InfoContainer>
          <DescContainer>
            <ProjectInfoDesc>{!props.projectInfo.project ? refreshInfo.project.description : props.projectInfo.project.description}</ProjectInfoDesc>
          </DescContainer>
          <ProjectInfo>{!puzzleSum ? "프로젝트에 퍼즐이 없습니다." : puzzleFinished + '/' + puzzleSum} ({!percent ? 0 : percent}%)</ProjectInfo>
          <ProjectInfo>
            {
              !props.projectInfo.project ?
                refreshInfo.project.teams.map(member => {
                  return (
                    <TeamImage src={member.profileImg} key={member.id} title={member.name}/>
                  )
                }) :
                props.projectInfo.project.teams.map(member => {
                  return (
                    <TeamImage src={member.profileImg} key={member.id} title={member.name}/>
                  )
                })
            }
          </ProjectInfo>
        </InfoContainer>
      </ProjectInfoContainer>
      
      <PuzzleBox ref={isFinishProject}>  {/* => puzzleBox */}
        {
          refreshInfo.project.puzzlesInfo.length === 0 ?
            <Message>퍼즐을 추가해 주세요</Message> : null
        }
        <StyledSlider {...settings}>
            {
              !props.projectInfo.project ?
              refreshInfo.project.puzzlesInfo.map(puzzle => {
                return (
                  <PuzzleInfo 
                    puzzleInfo={puzzle} 
                    key={puzzle.id} 
                    projectId={refreshInfo.project.id} 
                    projectInfo={refreshInfo.project}
                    percent={percent}
                    onePiecePercent={onePiecePercent}
                    fetchcoordinates={coordinates}
                    indexGenerator={indexGenerator}
                  />
                )
              }) :
                props.projectInfo.project.puzzlesInfo.map(puzzle => {
                  return (
                    <PuzzleInfo 
                    puzzleInfo={puzzle} 
                    key={puzzle.id}
                    projectId={refreshInfo.project.id} 
                    projectInfo={refreshInfo.project}
                    percent={percent}
                    onePiecePercent={onePiecePercent}
                    fetchcoordinates={coordinates}
                    indexGenerator={indexGenerator}
                    />
                  )
                })
            }
            
          
        </StyledSlider>
        <Title_container>
          <Comment_title>Comments</Comment_title>
        </Title_container>
        <Comment_section_container>
          {
            refreshInfo.project.comments.length ?
              <Comment_section>
              {
                !props.projectInfo.project ?
                refreshInfo.project.comments.map(comment => {
                  return <Comment commentInfo={comment} key={comment.id}/>
                }) : 
                props.projectInfo.project.comments.map(comment => {
                  return <Comment commentInfo={comment} key={comment.id}/>
                })
              }
            </Comment_section> 
            : 
            <CommentMessage>이 프로젝트에 등록된 댓글이 없습니다</CommentMessage>
          }
        </Comment_section_container>
      </PuzzleBox>

      <PuzzleSet
        showPuzzleSet={showPuzzleSet}
        setShowPuzzleSet={setShowPuzzleSet}
        projectInfo={refreshInfo.project}
        percent={percent}
        indexGenerator={indexGenerator}
      />

      {showArrow ? <BottomArrow src={arrow} onClick={goToBottom} /> : false }
      {isFinishMessage && <IsFinishModal> 프로젝트 완료!</IsFinishModal> }

    </ProjectContent_Container>
  )
}

export default ProjectContent

// <------------ css ------------> //
// #052439
const IsFinishModal = styled.div`
  position: absolute;
  top: 35%;
  right: 18%;
  transform: translatex(-50%);
  transform: rotate(-4deg);
  color: red;
  font-weight: bold;
  font-style: italic;
  border: thick double red;
  text-align: center; 
  width: 10em;
  margin-top: 0.5em;
`

const ProjectContent_Container = styled.div`
  position: relative;
  left: 1rem;
  background-color: rgb(25, 50, 77, 0.5);
  width: calc(100vw - 500px);
  height: 75vh;
  border-radius: 16px;
  overflow-x: auto;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    /* 세로 스크롤 넓이 */
    width: 12px;
    display: none;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
  }
  top: 1.5rem;
`
const Title_Container = styled.div`
  display: flex;
  justify-content: flex-start;
`
const Project_title = styled.div`
  color: white;
  font-size: 3rem;
  text-align: center;
  margin: auto;
  margin-top: 2vh;
  margin-bottom: 1.5vh;
  font-weight: bold;
  display: block;

  &::before {
    content: '< ';
  }

  &::after {
    content: ' >';
  }
`
const ProjectPuzzleImgSection = styled.div`
  position: relative;
  width: 20rem;
  height: 20rem;
  border-radius: 10px;
  border: 5px solid #afafaf;
  background-size: cover;
  background-color: white;
  margin-top: 1rem;
  margin-left: 100px;
  float: left;
`
const PuzzleBlock = styled.div`  /* (=wrapper) */
  display: grid;
  position: absolute;
  grid-template-columns: repeat(10, 2rem);
  grid-template-rows: repeat(10, 2rem);
  `

const PuzzleBlank = styled.div` /* 그리드 관련 스타일 */
  text-align: center;
  color: white;
  background-color: #afafaf;
`

const PuzzleImage = styled.img`
  position: absolute;
  width: 20rem;
  height: 20rem;
  background-size: cover;
  background-color: white;
  border-radius: 5px;
  float: left;
  z-index: 1;
`

const ProjectPuzzleSetbtn = styled.button`
  position: absolute;
  background: #fa991d;
  color: white;
  width: 100%;
  height: 50px;
  margin: 0 auto;
  font-size: 1.5rem;
  display: block;
  border: none;
  border-radius: 10px;
  top: 105%;
  left: 0%;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }

  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  -moz-text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
  -webkit-text-shadow: -1px 0 #F2F1F6, 0 1px #F2F1F6, 1px 0 #F2F1F6, 0 -1px #F2F1F6;

`
const ProjectInfoContainer = styled.div`
  display: flex;
  width: 32vw;
  position: relative;
  box-sizing: border-box;
  padding: 3rem 0px 0px;
  width: 55%;
`

const TextContainer = styled.div`
  
  font-weight: bold;
  color: #f5f5f5;
  width: 50%;
`

const InfoContainer = styled.div`
  display: relative;
  color: white;
`

const ProjectForm = styled.div`
  margin: 3rem;
  font-size: 1.5rem;
  font-weight: bolder;
  font-style: italic;
  border-radius: 5px;
  padding: 0.2rem 0.2rem;
  background: linear-gradient(to right, grey, rgb(25, 50, 77, 0.5) );
`
const DescContainer = styled.div`
  margin: 3em 3em 0rem 3em;
  display:flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  top: -0.5em;
  height: 4em;
  
`
const ProjectInfoDesc = styled.div`
  font-size: 1em;
  font-style: italic;
`
const ProjectInfo = styled.p`
  position: relative;
  top: -0.9em;
  margin: 1.8em 3em 2em 2em;
  font-size: 1.3rem;
  padding: 0.2rem 0.2rem;

`

const TeamImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  object-fit: cover;
  background-color:blue;
  border-radius: 50%;
  margin-top: 3px;
  margin-left: 3px;
  margin-right: 5px;
`


const PuzzleBox = styled.div`
  position: relative;
  width: calc(100vw - 700px);
  height: 70vh;
  background-color: #afafaf;
  top: 100px;
  margin: 0 auto;
  border-radius: 20px;
  border: 5px rgb(34,102,136) solid;
`

const StyledSlider = styled(Slider)`
  position: absolute;
  display: block;
  left: 0px;
  width: 100%;
  height: 40vh%;
  /* border: 1px black solid; */
`

const Comment_section_container = styled.div`
  position: relative;
  top: 54%;
`

const Comment_section = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: relative;
  top: 70%;
  height: 15rem;
  width: calc(100vw - 720px);
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

const Title_container = styled.div`
  position: relative;
  top: 53%;
`

const Comment_title = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 100%;
  width: 100%;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;

  &:before {
    content: "";
    flex-grow: 1;
    background: rgba(0, 0, 0);
    height: 2px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 16px;
  }
  &:after {
    content: "";
    flex-grow: 1;
    background: rgba(0, 0, 0);
    height: 2px;
    font-size: 0px;
    line-height: 0px;
    margin: 0px 16px;
  }
`

const BottomArrow = styled.img`
  position: fixed;
  bottom: 10%;
  left: 52%;
  border: 0px solid white;
  transform: rotate(90deg);
  cursor: pointer;

`

const Message = styled.span`
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  color: black;
  font-style: italic;
  font-weight: bold;
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
  -moz-text-shadow: -1px 0 #F2F1F6, 0 1px #F2F1F6, 1px 0 #F2F1F6, 0 -1px #F2F1F6;
  -webkit-text-shadow: -1px 0 #F2F1F6, 0 1px #F2F1F6, 1px 0 #F2F1F6, 0 -1px #F2F1F6;

`

const IsProgress = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 85%;
  transform: translateX(-50%);
  z-index: 5;
  color: black;
  font-style: italic;
  font-weight: bold;
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
  -moz-text-shadow: -1px 0 #F2F1F6, 0 1px #F2F1F6, 1px 0 #F2F1F6, 0 -1px #F2F1F6;
  -webkit-text-shadow: -1px 0 #F2F1F6, 0 1px #F2F1F6, 1px 0 #F2F1F6, 0 -1px #F2F1F6;
  
`

const CommentMessage = styled.div`
  position: absolute;
  top: 5em;
  left: 50%;
  transform: translateX(-50%);
  color: black;
  font-style: italic;
  font-weight: bold;
  text-shadow: -1px 0 white, 0 1px white, 1px 0 white, 0 -1px white;
  -moz-text-shadow: -1px 0 #F2F1F6, 0 1px #F2F1F6, 1px 0 #F2F1F6, 0 -1px #F2F1F6;
  -webkit-text-shadow: -1px 0 #F2F1F6, 0 1px #F2F1F6, 1px 0 #F2F1F6, 0 -1px #F2F1F6;
`
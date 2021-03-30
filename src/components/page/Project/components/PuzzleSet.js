import React, { useRef, useEffect, useCallback, useState } from 'react'
import { useSpring, animated } from 'react-spring'
import styled from 'styled-components'
import Img1 from '../../../../images/icon/img.jpg'
import Img2 from '../../../../images/icon/puzzle_3x3.jpg'
import { MdClose } from 'react-icons/md'
import axios from 'axios'

export const PuzzleSet = ({ showPuzzleSet, setShowPuzzleSet, projectInfo, percent, indexGenerator }) => {
  const modalRef = useRef()
  const projectid = projectInfo.id
  const [inputs, setInputs] = useState({
    description: '',
    title: '',
    projectId: projectid
  })
  const accessToken = sessionStorage.getItem("accessToken");

  // const [currMem, setCurrMem] = useState(['김코딩'])

  const animation = useSpring({
    config: {
      duration: 250,
    },
    opacity: showPuzzleSet ? 1 : 0,
    transform: showPuzzleSet ? `translateY(0%)` : `translateY(-100%)`,
  })

  const closeModal = e => {
    if (modalRef.current === e.target) {
      setShowPuzzleSet(false)
    }
  }

  const keyPress = useCallback(
    e => {
      if (e.key === 'Escape' && showPuzzleSet) {
        setShowPuzzleSet(false)
      }
    },
    [setShowPuzzleSet, showPuzzleSet]
  )

  useEffect(() => {
    document.addEventListener('keydown', keyPress)
    return () => document.removeEventListener('keydown', keyPress)
  }, [keyPress])

  const onChange = e => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value
    })
  }

  const createPuzzle = () => {
    if (inputs.description.length === 0) {
      alert('퍼즐 내용을 입력해 주세요')
      return;

    }
    if (inputs.title.length === 0 || inputs.title.length > 30) {//일이삼사오일이삼사오일이삼사오일이삼사오일이삼사오일이삼사오일이삼사오일이삼사오
      alert('퍼즐 제목을 입력해주세요(1~40자)')
      return;
    }
    axios.post('https://api.teampuzzle.ga:4000/puzzle/create', {
      ...inputs
      }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.data.data === "ok") {
        alert('퍼즐이 등록되었습니다');
      }
    })
    .then(res => {
      axios.get(`https://api.teampuzzle.ga:4000/project/${projectid}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
      }
      })
      .then(res => {
        const stringInfo = JSON.stringify(res.data);
        sessionStorage.setItem('projectInfo', stringInfo);
      })
    })
    .then(res => {
      let projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'))
      const puzzlesInfo = projectInfo.project.puzzlesInfo;
      const puzzleSum = puzzlesInfo.length;
      const puzzleFinished = puzzlesInfo.filter(puzzle => {
        if (puzzle.isFinish === 1) {
          return true;
        }
        return false;
      }).length
      const newPercent = parseInt((puzzleFinished / puzzleSum) * 100)
      console.log(newPercent)
      //전체 퍼즐의 개수가 늘어나면서 그리드의 개수가 늘어난다(새로운 퍼즐은 isFinish ===0이니까)
      //여기서 그리드 다시 렌더해야 한다(project/update/${projectId})
      //1. 배열로 변환 2. 배열에 숫자 추가(몇개?: 퍼즐 하나 분량의 %: onePiecePercent)
      //혹은 %와 동기화
        //[1~100] 배열만들어서 percent만큼 배열에서 랜덤으로 제거
      const coordinates = indexGenerator();
      for (let i=0; i< newPercent; i++) {
        coordinates.splice(Math.floor(Math.random() * coordinates.length), 1)[0];
        console.log(coordinates)
      }
      axios.post(`https://api.teampuzzle.ga:4000/project/update/${projectid}`, {
        coordinates: coordinates.toString(),
        usercode: [],
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'  
        }    
      })
      .then(res => {
        console.log(res.data)
      })
    })
    .then(res => {
      axios.get(`https://api.teampuzzle.ga:4000/project/${projectid}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        console.log(res.data)
        const stringInfo = JSON.stringify(res.data);
        sessionStorage.setItem('projectInfo', stringInfo);
      })
      .then(res => {
        setInputs({
          description: '',
          title: '',
          projectId: projectid
        });
        setShowPuzzleSet(false);
        let projectInfo = JSON.parse(sessionStorage.getItem('projectInfo'))
          window.location.reload();
        
        //!왜 렌더하고 처음으로 생성하는 퍼즐은 새로고침이 필요할까?
      })
    })
    
    .catch(err => console.log(err));

  }

  return (
    <>
      {showPuzzleSet ? (
        <Background onClick={closeModal} ref={modalRef}>
          <animated.div style={animation}>
            <ModalWrapper showPuzzleSet={showPuzzleSet}>
              <Title>퍼즐 설정</Title>
              <PuzzleContainer>
                <TitleContainer>
                  <PuzzleTitle placeholder="제목을 입력하세요(1~30자)" onChange={onChange} name="title"></PuzzleTitle>
                </TitleContainer>
                <DescContainer>
                  <PuzzleDesc placeholder="작업 내용을 입력하세요" onChange={onChange} name="description"></PuzzleDesc>
                </DescContainer>
              </PuzzleContainer>
              <CloseModalButton
                aria-label="Close modal"
                onClick={() => setShowPuzzleSet(prev => !prev)}
              />
              <Confirmbtn onClick={() => createPuzzle()}>
                확인
              </Confirmbtn>
            </ModalWrapper>
          </animated.div>
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
  z-index: 5;
`

const ModalWrapper = styled.div`
  width: 800px;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: rgb(25, 50, 77, 0.95);
  position: relative;
  border-radius: 10px;
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

const Title = styled.div`
  font-size: 2rem;
  color: white;
  padding-left: 40px;
  padding-top: 40px;
  padding-bottom: 40px;
  margin: 0 auto;
`
const PuzzleImg = styled.div`
  background-image: url(${Img1});
  width: 250px;
  height: 250px;
  margin-left: 40px;
  border-radius: 5%;
  background-size: cover;
  background-color: white;
`
const PuzzleImg2 = styled.a`
  background-image: url(${Img2});
  width: 80px;
  height: 80px;
  border-radius: 5%;
  background-size: cover;
  background-color: white;
  &:active,
  &:focus,
  &:target {
    border: 3px solid red;
  }
`
const PuzzleSize = styled.div`
  color: white;
  font-size: 1.1rem;
  padding-top: 5px;
  padding-left: 20px;
`

const PuzzleSetBox = styled.span`
  position: relative;
  top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  cursor: pointer;
`

const PuzzleSetContainer = styled.div`
  display: flex;
  position: relative;
  top: -250px;
  left: 130px;
  flex-wrap: wrap;
  justify-content: space-around;
  margin: auto;
  width: 300px;
  height: 220px;
`

const ChangeImgbtn = styled.button`
  position: relative;
  top: -200px;
  left: 200px;
  border-radius: 10px;
  border: none;
  background: #fa991d;
  color: white;
  width: 80px;
  height: 38px;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
`
const Confirmbtn = styled.button`
  position: relative;
  top: 10px;
  left: 50%;
  transform: translate(-50%);
  border-radius: 10px;
  border: none;
  background: #fa991d;
  font-size: 1.3rem;
  color: white;
  width: 120px;
  height: 50px;
  cursor: pointer;
  &:active,
  &:focus {
    outline: none;
  }
`

const PuzzleTitle = styled.input`
  width: 40%;
  height: 1.5em;
  text-align: center;
`

const PuzzleDesc = styled.textarea`
  width: 80%;
  height: 20em;
  resize: none;
  white-space:pre;
`

const PuzzleContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const TitleContainer = styled.div`
  text-align: center;
  justify-content: center;
  /* border: 1px black solid; */


`

const DescContainer = styled.div`
  display: flex;
  justify-content: center;
  /* border: 1px white solid; */

`

const BorderLine = styled.div`
  flex-grow: 1;
  background: black;
  height: 3px;
  font-size: 0px;
  line-height: 0px;
  margin: 10px 16px;

`
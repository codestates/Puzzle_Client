import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'


const PuzzleInfo = ({puzzleInfo, fetchcoordinates, projectId, onePiecePercent, indexGenerator}) => {
  const accessToken = sessionStorage.getItem('accessToken')
  const isFinishPuzzle = useRef();
  const modifyInput = useRef();
  const title = useRef();
  const modifyTitleInput = useRef();
  const [isMyPuzzle, setIsMyPuzzle] = useState(false);
  const [isModifyModal, setIsModifyModal] = useState(false);
  const [isTitleModify, setIsTitleModify] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
  const [titleInput, SetTitleInput] = useState(puzzleInfo.title);
  const [commentInput, SetCommentInput] = useState('');
  const [puzzleInput, setPuzzleInput] = useState(puzzleInfo.description);

  const check = {
    fontStyle: 'italic',
    fontSize: 1.5+'rem',
    position: 'relative',
    left: -10 + 'px'
  }
  const refreshInfo = JSON.parse(sessionStorage.getItem('projectInfo'))
  const loginUserId = refreshInfo.loginUser.id;
  const puzzleWriterId = puzzleInfo.writer.id;
  
  useEffect(() => {
    if (!isModifyModal) {
      modifyInput.current.style.display = "none";
      isFinishPuzzle.current.style.display = "block";
    }else {
      isFinishPuzzle.current.style.display = "none";
      modifyInput.current.style.display = "block";
      modifyInput.current.focus();
    }
  }, [isModifyModal]);

  useEffect(() => {
    //여기서 dom에 접근해서 state값에 따라서 렌더할 요소 선택
    if (!isTitleModify) {
      modifyTitleInput.current.style.display = "none";
      title.current.style.display = "block";
    }else {
      title.current.style.display = "none";
      modifyTitleInput.current.style.display = "block";
      modifyTitleInput.current.focus();
    }
  }, [isTitleModify])

  useEffect(() => {
    const loginId = JSON.parse(sessionStorage.getItem('projectInfo')).loginUser.id
    if (loginId === puzzleInfo.writer.id ) {
      setIsMyPuzzle(true)
    }
    if (puzzleInfo.isFinish === 1) {
      isFinishPuzzle.current.style.border = "3px solid #ba235b";
      isFinishPuzzle.current.style.textDecoration = "line-through"
    }
  });

  const completePuzzle = (coordinates) => {
    const coordi = coordinates.slice();
    
    for (let i=0; i<onePiecePercent; i++) {
      coordi.splice(Math.floor(Math.random() * coordi.length), 1)[0];
    }
    axios.post(`https://api.teampuzzle.ga:4000/project/update/${projectId}`, {
      coordinates: coordi.toString(),
      usercode: [],
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'  
      }
    })
    .then(res => {
      axios.post(`https://api.teampuzzle.ga:4000/puzzle/update/${puzzleInfo.id}`,{
        isFinish: 1
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        } 
      }).then(res => {
        axios.get(`https://api.teampuzzle.ga:4000/project/${projectId}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
          }
        })
        .then(res => {
          const stringInfo = JSON.stringify(res.data);
          sessionStorage.setItem('projectInfo', stringInfo);
        })
        .then(res => {
          window.location.reload();
        })
      })
      console.log('success')
    })
  }

  const unCompletedPuzzle = (coordinates) => {
    //isFinish를 다시 false로 변경 
    //그에 맞춰서 coordinates에 onePiecePercent만큼 랜덤으로 숫자 추가 
    const coordi = coordinates.slice();
    const addRandomNumber = (numberOfNumber, coor) => {
      for (let i=0; i<numberOfNumber; i++) {
        let randomNum = Math.floor((Math.random() * 100) + 1);
        if (coor.indexOf(randomNum) === -1) {
          coor.push(randomNum)
        }else {
          i--;
        }
      }
      return coor;
    }
    const newCoordinates = addRandomNumber(onePiecePercent, coordi);
    axios.post(`https://api.teampuzzle.ga:4000/project/update/${projectId}`, {
      coordinates: newCoordinates.toString(),
      usercode: [],
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'  
      }
    })
    .then(res => {
      axios.post(`https://api.teampuzzle.ga:4000/puzzle/update/${puzzleInfo.id}`, {
        isFinish: 0
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'  
        }  
      }).then(res => {
        axios.get(`https://api.teampuzzle.ga:4000/project/${projectId}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        })
      .then(res => {
        const stringInfo = JSON.stringify(res.data);
        sessionStorage.setItem('projectInfo', stringInfo);
      })
      .then(res => {
        window.location.reload();
      })
    })
      console.log('isFinish cancel success')
    })
  }

  const onChangeComment = e => {
    SetCommentInput(e.target.value);    
  }

  const submitCommentHandler = () => {
    if (commentInput.length === 0) {
      alert('내용을 입력한 후 제출해 주십시오')
      return;
    }
    axios.post(`https://api.teampuzzle.ga:4000/comment/create`, {
      description: commentInput,
      puzzleId: puzzleInfo.id
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      axios.get(`https://api.teampuzzle.ga:4000/project/${projectId}`,{
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
      SetCommentInput('');
      alert('댓글 등록 완료')
      window.location.reload();
    })
    .catch(err => console.log(err))
  }

  const deleteBtnHandler = () => {
    setDeleteConfirmModal(prev => !prev);
  }

  const deletePuzzle = () => {
    axios.delete(`https://api.teampuzzle.ga:4000/puzzle/delete/${puzzleInfo.id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      setDeleteConfirmModal(false);
      //프로젝트 정보 요청해서 세션 스토리지에 담고 새로고침
      //전체 퍼즐 갯수가 변하는 것이니, 퍼즐 렌더링도 그에 맞추어 바꾸어 주어야 한다
      axios.get(`https://api.teampuzzle.ga:4000/project/${projectId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
      })
      .then(res => {
        const stringInfo = JSON.stringify(res.data);
        sessionStorage.setItem('projectInfo', stringInfo);
        return res.data
      })
      .then(data => {
        //새로운 percent를 계산하는 작업 
        let projectInfo = data;
        const puzzlesInfo = projectInfo.project.puzzlesInfo;
        const puzzleSum = puzzlesInfo.length;
        const puzzleFinished = puzzlesInfo.filter(puzzle => {
          if (puzzle.isFinish === 1) {
            return true;
          }
          return false;
        }).length
        const newPercent = parseInt((puzzleFinished / puzzleSum) * 100)
        const coordinates = indexGenerator();
        //1~100까지의 숫자를 요소로 갖는 배열(초기값)에서 새로계산한 percent만큼 랜덤으로 coordinates 배열에서 요소를 제거한다
        for (let i=0; i< newPercent; i++) {
          coordinates.splice(Math.floor(Math.random() * coordinates.length), 1)[0];
        }

        axios.post(`https://api.teampuzzle.ga:4000/project/update/${projectId}`, {
          coordinates: coordinates.toString(),
          usercode: [],
        }, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'  
          }    
        })
        .then(res => {
          axios.get(`https://api.teampuzzle.ga:4000/project/${projectId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
          })
          .then(res => {
            const stringInfo = JSON.stringify(res.data);
            sessionStorage.setItem('projectInfo', stringInfo);
          })
          .then(res => window.location.reload())    
        })  
      })
    })
    .catch(err => console.log(err))
  }

  const handleModifyInput = () => {
    setIsModifyModal(prev => !prev);
    console.log('포커스')
    console.log(modifyInput.current.focus)
  }

  const onChangeModifyInput = (e) => {
    setPuzzleInput(e.target.value);
  }

  const updatePuzzleDesc = () => {
    //퍼즐 update
    axios.post(`https://api.teampuzzle.ga:4000/puzzle/update/${puzzleInfo.id}`, {
      description: puzzleInput
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      } 
    })
    .then(res => {
      axios.get(`https://api.teampuzzle.ga:4000/project/${projectId}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
      })
      .then(res => {
        const stringInfo = JSON.stringify(res.data);
        sessionStorage.setItem('projectInfo', stringInfo);
      })
      .then(res => {
        window.location.reload();
      })
    })
    .catch(err => console.log(err))
  }
  const updatePuzzleTitle = () => {
    console.log(titleInput)
    axios.post(`https://api.teampuzzle.ga:4000/puzzle/update/${puzzleInfo.id}`, {
      title: titleInput
    }, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      } 
    })
    .then(res => {
      axios.get(`https://api.teampuzzle.ga:4000/project/${projectId}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
      })
      .then(res => {
        const stringInfo = JSON.stringify(res.data);
        sessionStorage.setItem('projectInfo', stringInfo);
      })
      .then(res => {
        window.location.reload();
      })
    })
    .catch(err => console.log(err))

  }
  const modifyPuzzleTitle = () => {
    //state를 true 상태로 만들어서, 제목 부분의 텍스트를 input(type="text"로 대체한다)
      //useRef를 사용할 일이 있으면 useEffect && style.display = 'none'를 이용
      //사용할 일이 있다 => input focus를 위해서
      setIsTitleModify(prev => !prev);
  }

  const OnChangePuzzleTitle = e => {
    SetTitleInput(e.target.value)
  }

  
  return (
    <PuzzleContainer>
      <PuzzleNum>
        <PuzzleTitle ref={title}>{puzzleInfo.title}: {puzzleInfo.particle}번째 퍼즐</PuzzleTitle>
        <PuzzleTitleModifyInput ref={modifyTitleInput} type="text" onChange={OnChangePuzzleTitle} value={titleInput}/>
        { isTitleModify && <PuzzleTitleModifySubmit onClick={updatePuzzleTitle}>Submit</PuzzleTitleModifySubmit>}
        {
          loginUserId === puzzleWriterId && puzzleInfo.isFinish === 0 ?
            <PuzzleTitleModifyBtn onClick={modifyPuzzleTitle}>수정</PuzzleTitleModifyBtn> : null
        }
      </PuzzleNum>
      <PuzzleHead>
        <PuzzleInfoContainer>
          <PuzzleWriter>{puzzleInfo.writer.name} </PuzzleWriter>
          <PuzzleUpdatedAt>{puzzleInfo.updatedAt.slice(0, 10)}</PuzzleUpdatedAt>
          {
            isMyPuzzle ?
              <>
                {
                  !puzzleInfo.isFinish ? 
                    <PuzzleFinished onClick={() => completePuzzle(fetchcoordinates)}><span style={check}>✔</span>작업 완료하기</PuzzleFinished>
                  : 
                    <PuzzleFinishedCancel onClick={() => unCompletedPuzzle(fetchcoordinates)}><span style={check}>✗</span>작업 완료 취소</PuzzleFinishedCancel>
                }
              </> : null
          }
        </PuzzleInfoContainer>
        {
          loginUserId === puzzleWriterId && puzzleInfo.isFinish === 0 ?
            <PuzzleButtonContainer>
              <PuzzleModified onClick={handleModifyInput}>수정</PuzzleModified>
              <PuzzleDeleted onClick={deleteBtnHandler}>삭제</PuzzleDeleted>
            </PuzzleButtonContainer>
          : null
        }
      </PuzzleHead>
      <PuzzleContent>{/* length: 1070 */}
        <PuzzleDesc ref={isFinishPuzzle}>{puzzleInfo.description}</PuzzleDesc>
        <PuzzleModifyInput ref={modifyInput} placeholder="내용을 입력해주세요" onChange={(e) => onChangeModifyInput(e)} value={puzzleInput} /> 
      </PuzzleContent>

      <ModifyBtnContainer>
        {isModifyModal && <ModifyPuzzleConfirmBtn onClick={updatePuzzleDesc}>Submit</ModifyPuzzleConfirmBtn>}
      </ModifyBtnContainer>
      
      <PuzzleCommentSec>
        <CommentInput value={commentInput} placeholder="댓글을 입력해주세요. 입력한 댓글은 Comments 섹션에 나열됩니다." onChange={onChangeComment}/>
        <CommentSubmit onClick={submitCommentHandler}>Submit</CommentSubmit>
      </PuzzleCommentSec>
      {
        deleteConfirmModal ?
        <DeletePuzzleModal>
          <DeletePuzzleMessage>이 퍼즐을 삭제하시겠습니까?</DeletePuzzleMessage>
          <DeleteModalBtnContainer>
            <DeleteYesBtn onClick={deletePuzzle}>예</DeleteYesBtn>
            <DeleteNoBtn onClick={() => {setDeleteConfirmModal(prev => !prev)}}>아니요</DeleteNoBtn>
          </DeleteModalBtnContainer>
        </DeletePuzzleModal>
        : null
      }
    </PuzzleContainer>
  )
}

const PuzzleContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 300px;
  /* border: 2px solid green; */
  overflow: visible;

`
const PuzzleTitleModifySubmit = styled.button`
  display: flex;
  align-items: center;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 2.3em;
  position: relative;
  background: #d96602;
  border-radius: 10px;

  &:hover {
    background: #e69b5a;
  }
  &:active {
    background: #a36c3b;
  }

`
const PuzzleTitleModifyBtn = styled.button`
  /* 공통 스타일 */
  display: inline-block;
  outline: none;
  border: none;
  border-radius: 4px;
  color: black;
  cursor: pointer;

  /* 크기 */
  font-size: 0.1em;
  height: 6em;

  /* 색상 */
  background: #3c556d;
  &:hover {
    background: #4978a3;
  }
  &:active {
    background: #2b4257;
  }
`
const PuzzleHead = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: none;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 1rem 1rem 0;
  /* border: 3px solid red; */
`
const PuzzleInfoContainer = styled.div`
  display: flex;
  box-sizing: border-box;
  justify-content: flex-start;
`

const PuzzleButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 9%;
`
const PuzzleContent = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem 1rem 0.2rem 1rem;
  /* border: 2px solid yellow; */
`

const ModifyBtnContainer = styled.div`
  min-height: 2.8em;
  display: flex;
  justify-content: flex-end;
  padding-right: 1.5rem;
`

const Label = styled.div`  /* 삭제하지 말것 */
  box-sizing: border-box;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid black;
  border-radius: 10px;
  margin: 0 0.2rem 1rem;
`

const PuzzleDesc = styled.pre`
  color: black;
  border: 3px solid #5599ee;
  border-radius: 15px;
  height: 90px;
  box-sizing: border-box;
  padding: 1rem;
  background-color: white;
  line-height: 25px;
  overflow: scroll;
  font-size: 1em;

  &::-webkit-scrollbar {
    display: none;
  }
`
const PuzzleModifyInput = styled.textarea`
  color: black;
  border: 3px dashed black;
  border-radius: 15px;
  height: 90px;
  width: 100%;
  box-sizing: border-box;
  padding: 1rem;
  background-color: white;
  line-height: 25px;
  overflow: scroll;
  font-size: 1.2em;
  text-align: left;

  &:focus {
    outline: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }

`

const ModifyPuzzleConfirmBtn = styled.button`
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
  align-items: center;


  /* 크기 */
  height: 2em;
  font-size: 0.8em;
  width: 6em;

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


const PuzzleCommentSec = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
  margin-right: 1rem;
  height: 15%;
`

const CommentInput = styled.textarea`
  display: block;
  box-sizing: border-box;
  text-align: left;
  border: 2px grey solid;
  width: 98%;
  height: 70px;
  margin-bottom: 1rem;
  resize: none;

  &::placeholder {
    color:  #3c556d;
  }
`
const CommentSubmit = styled.button`
  display: flex;
  align-items: center;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 25px;
  position: relative;
  top: -5px;
  right: 5px;

  background: #3c556d;
  &:hover {
    background: #4978a3;
  }
  &:active {
    background: #2b4257;
  }

`
const PuzzleWriter = styled.div`
  font-weight: bold;

  &:after {
    content: '/';
    font-weight: normal;
  }

`

const PuzzleNum = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  padding: 10px 0px 10px;
  background-color: #3c556d;
  color: whitesmoke;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`
const PuzzleTitle = styled.div`

`
const PuzzleTitleModifyInput = styled.input`
  border-radius: 10px;

  &:focus {
    outline: none;
  }
  height: 1.9em;
  width: 30em;
  text-align: center;
`

const PuzzleUpdatedAt = styled.div`
  margin:0 0.5rem;
`

const PuzzleFinished = styled.button`
  display: flex;
  align-items: center;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-style: italic;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 22px;
  position: relative;
  top: -3px;
  background: #cc4a3b;

  &::before {
    content: url("src/images/icon/complete.png");
  }
`
const PuzzleFinishedCancel = styled.button`
  display: flex;
  align-items: center;
  outline: none;
  border: none;
  border-radius: 4px;
  color: white;
  font-style: italic;
  font-weight: bold;
  cursor: pointer;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 22px;
  position: relative;
  top: -3px;
  background: #85559e;

`


const PuzzleModified = styled.button`
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
  height: 1.25rem;
  font-size: 0.5rem;

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


const PuzzleDeleted = styled.button`
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
  height: 1.25rem;
  font-size: 0.5rem;

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

const DeletePuzzleModal = styled.div`
  position: relative;
  bottom: 13em;
  left: 0px;
  height: 5em;
  width: 25em;
  background-color: whitesmoke;
  text-align: center;
  margin: 0 auto;
  border-radius: 15px;
  box-shadow: 1px 1px 1px 1px;
`
const DeletePuzzleMessage = styled.div`
  position: absolute;
  top: 1em;
  left: 50%;
  transform: translateX(-50%);

`

const DeleteModalBtnContainer = styled.div`
  display: flex;
  justify-content: space-around;
  position: absolute;
  top: 2em;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 0.8em;
  width: 30%;
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
  height: 1.25rem;
  font-size: 0.5rem;

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
  height: 1.25em;
  font-size: 0.5rem;

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




export default PuzzleInfo

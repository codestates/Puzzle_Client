import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import axios from 'axios'


const Comment = (props) => {
  const [ puzzleInfo, setPuzzleInfo]  = useState({});
  const [ particle, setParticle ] = useState('');
  const [ isModifyComment, SetIsModifyComment ] = useState(false);
  const [ newComment, setNewComment ] = useState('');
  const commentContent = useRef();
  const commentModiInputContainer = useRef();
  const commentModiInput = useRef();
  const accessToken = sessionStorage.getItem('accessToken');
  const puzzleId = props.commentInfo.puzzleId;
  const loginUser = JSON.parse(sessionStorage.getItem('projectInfo')).loginUser;
  const projectId = JSON.parse(sessionStorage.getItem('projectInfo')).project.id;
  
  useEffect(() => {
    if (isModifyComment) {
      //input이 보여야
      commentModiInputContainer.current.style.display = "block";
      commentContent.current.style.display = "none";
      commentModiInput.current.focus();
    }else {
      commentModiInputContainer.current.style.display = "none";
      commentContent.current.style.display = "block";
    }
  }, [isModifyComment])

  useEffect(() => {
    axios.get(`https://api.teampuzzle.ga:4000/puzzle/read/${puzzleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      setPuzzleInfo({...res.data})
      const stringInfo = JSON.stringify(res.data)
      sessionStorage.setItem('puzzleInfo', stringInfo);
      setParticle(res.data.puzzle.particle)
    })
  }, [])

  const deleteComment = () => {
    console.log('삭제')
    axios.delete(`https://api.teampuzzle.ga:4000/comment/delete/${props.commentInfo.id}`, {
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
        commentSection.current.focus()
      })

    })
    .catch(err => console.log(err))
  }

  const handleModifyInput = () => {
    SetIsModifyComment(prev => !prev);
  }

  const onChangeNewComment = e => {
    setNewComment(e.target.value)
  }

  const ModifyComment = () => {
    axios.post(`https://api.teampuzzle.ga:4000/comment/update/${props.commentInfo.id}`, {
      desc: newComment
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
  return (
    <CommentContainer> 
      <Comment_Info_container>
        <Writer_Info>
          <Writer_Name>{props.commentInfo["user.name"]}</Writer_Name>
          <Updated_At>{props.commentInfo.updatedAt.slice(0, 10)}</Updated_At>
          <PuzzleNum>{particle}번째 퍼즐의 댓글입니다</PuzzleNum>
        </Writer_Info>
        
        <Comment_Buttons_Container>
          {
            props.commentInfo.userId === loginUser.id ?
              <>
                <Comment_Modify_Button onClick={handleModifyInput}>수정</Comment_Modify_Button>
                <Comment_Delete_Button onClick={deleteComment}>삭제</Comment_Delete_Button>
              </>
            : null
          }
        </Comment_Buttons_Container>
      </Comment_Info_container>
      <Comment_Contents ref={commentContent}>{props.commentInfo.description}</Comment_Contents>
      <TextArea_Container ref={commentModiInputContainer}>
        <Comment_Content_Modify_TxtArea ref={commentModiInput} value={newComment} onChange={onChangeNewComment} placeholder="댓글을 수정해 주세요."/>
        <Comment_Modify_Submit_Button onClick={ModifyComment}>Submit</Comment_Modify_Submit_Button>
      </TextArea_Container>
  </CommentContainer>
  )
}

export default Comment



const CommentContainer = styled.pre`
  color: black;
  border: 2px solid black;
  border-radius: 5px;
  width: 90%;
  box-sizing: border-box;
  padding: 1em;
  background-color: white;
  line-height: 25px;
  margin: 0 1rem 1rem 1rem;
`

const Comment_Info_container = styled.div`
  display: flex;
  justify-content: space-around;
  position: relative;
  top: -20px;
  left: -10px;
  /* border: 1px blue solid; */
  width: 100%;
`

const Comment_Buttons_Container = styled.div`
  display: flex;
  position: relative;
  right: -20px;
  justify-content: flex-end;
  align-items: center;
  /* border: 1px brown solid; */
  width: 13%;
`

const Comment_Contents = styled.div`
  position: relative;
  top: -10px;
  margin-bottom: 1rem;
`

const TextArea_Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Comment_Content_Modify_TxtArea = styled.textarea`
  display: block;
  width: 100%;
  resize: none;
  border: 2px solid black;
  outline: none;
  font-size: 1.2em;
`

const Comment_Modify_Submit_Button = styled.button`
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
const Comment_Modify_Button = styled.button`
  /* 공통 스타일 */
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
  background: white;
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

const Comment_Delete_Button = styled.button`
  /* 공통 스타일 */
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
  background: white;
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
const Writer_Info = styled.div`
  width: 100%;
  display: flex;
  text-align: left;
  padding: 0.5rem 0 0 0.5rem;
`

const Writer_Name = styled.div`
  font-weight: bold;

  &:after {
    content: '/';
    font-weight: normal;
  }
`

const Updated_At = styled.div`
  padding: 0 0.5rem 0 0.3rem;
  font-size: 0.8rem;
`

const PuzzleNum = styled.div`
  font-size: 0.8rem;
  color: grey;
`




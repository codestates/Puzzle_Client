import React, { useState } from 'react';
import styled from 'styled-components';

import { ArrowIosBackOutline } from '@styled-icons/evaicons-outline/ArrowIosBackOutline';
import { ArrowIosForwardOutline } from '@styled-icons/evaicons-outline/ArrowIosForwardOutline';

const CalendarAPI = () => {
    let date = new Date();

    const [viewYear, setViewYear] = useState(date.getFullYear());
    const [viewMonth, setViewMonth] = useState(date.getMonth());

    let prevLast = new Date(viewYear, viewMonth, 0);
    let thisLast = new Date(viewYear, viewMonth + 1, 0);

    let PLDate = prevLast.getDate();
    let PLDay = prevLast.getDay();

    let TLDate = thisLast.getDate();
    let TLDay = thisLast.getDay();

    let prevDates = [];
    let thisDates = [...Array(TLDate + 1).keys()].slice(1);
    let nextDates = [];

    if (PLDay !== 6) {
        for (let i = 0; i < PLDay + 1; i++) {
          prevDates.unshift(PLDate - i);
        }
      }
    let temp = prevDates.concat(thisDates);

     for (let i = 1; i <= 42 - temp.length; i++) {
        nextDates.push(i)
    }

    let dates = temp.concat(nextDates);

    const firstDateIndex = dates.indexOf(1);
    const lastDateIndex = dates.lastIndexOf(TLDate);

    dates.forEach((date, i) => {
        const condition = i >= firstDateIndex && i < lastDateIndex + 1 ? false : true;
        dates[i] = 
        <Calendar_Day_Text_Containers key={i++} >
            <Calendar_Day_Text condition = {condition} >{date}</Calendar_Day_Text>
        </Calendar_Day_Text_Containers>;
    })
    
    const preYear = () => {
        setViewYear(date.getFullYear(date.setFullYear(viewYear - 1)));
    }

    const nextYear = () => {
        setViewYear(date.getFullYear(date.setFullYear(viewYear + 1)));
    }

    const selectMonth = (e) => {
        const {
            target: {innerText}
        } = e
        if(innerText === '1 월'){
            setViewMonth(date.getMonth(date.setMonth(0)));
        }
        if(innerText === '2 월'){
            setViewMonth(date.getMonth(date.setMonth(1)));
        }
        if(innerText === '3 월'){
            setViewMonth(date.getMonth(date.setMonth(2)));
        }
        if(innerText === '4 월'){
            setViewMonth(date.getMonth(date.setMonth(3)));
        }
        if(innerText === '5 월'){
            setViewMonth(date.getMonth(date.setMonth(4)));
        }
        if(innerText === '6 월'){
            setViewMonth(date.getMonth(date.setMonth(5)));
        }
        if(innerText === '7 월'){
            setViewMonth(date.getMonth(date.setMonth(6)));
        }
        if(innerText === '8 월'){
            setViewMonth(date.getMonth(date.setMonth(7)));
        }
        if(innerText === '9 월'){
            setViewMonth(date.getMonth(date.setMonth(8)));
        }
        if(innerText === '10 월'){
            setViewMonth(date.getMonth(date.setMonth(9)));
        }
        if(innerText === '11 월'){
            setViewMonth(date.getMonth(date.setMonth(10)));
        }
        if(innerText === '12 월'){
            setViewMonth(date.getMonth(date.setMonth(11)));
        }
    }

    return (
        <Calendar_Containers>
            <Calendar_Year_Month_Containers>
                <Calendar_Year_Containers>
                    <Calendar_Year_Prev_btn onClick={preYear}></Calendar_Year_Prev_btn>
                    <Calendar_Year_Text>{viewYear}</Calendar_Year_Text>
                    <Calendar_Year_Next_btn onClick={nextYear}></Calendar_Year_Next_btn>
                </Calendar_Year_Containers>
                <Calendar_Month_Containers>
                    <Calendar_Month_Text onClick={selectMonth} >1 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >2 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >3 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >4 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >5 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >6 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >7 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >8 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >9 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >10 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >11 월</Calendar_Month_Text>
                    <Calendar_Month_Text onClick={selectMonth} >12 월</Calendar_Month_Text>
                    <Calendar_Month_Footer></Calendar_Month_Footer>
                </Calendar_Month_Containers>
            </Calendar_Year_Month_Containers>
            <Calendar_Day_Containers>
                <Calendar_Day_Inside_Containers>
                    <Calendar_Days_Title_Containers>
                        <Calendar_Days_Title>{viewMonth + 1}월</Calendar_Days_Title>
                    </Calendar_Days_Title_Containers>
                    <Calendar_Days_Text_Containers>
                        <Calendar_Days_Text>일</Calendar_Days_Text>
                        <Calendar_Days_Text>월</Calendar_Days_Text>
                        <Calendar_Days_Text>화</Calendar_Days_Text>
                        <Calendar_Days_Text>수</Calendar_Days_Text>
                        <Calendar_Days_Text>목</Calendar_Days_Text>
                        <Calendar_Days_Text>금</Calendar_Days_Text>
                        <Calendar_Days_Text>토</Calendar_Days_Text>
                    </Calendar_Days_Text_Containers>
                    <Calendar_Day_Body_Containers>
                        {dates}
                    </Calendar_Day_Body_Containers>
                </Calendar_Day_Inside_Containers>
            </Calendar_Day_Containers>
            <Calendar_Text_Containers>
                <Calendar_Text>퍼즐1을 생성했습니다.</Calendar_Text>
            </Calendar_Text_Containers>
        </Calendar_Containers>
    )
}

export default CalendarAPI;

// <------------ css ------------> //

const Calendar_Containers = styled.div`
    position: relative;
    top: 3em;
    height: 100%;
    display:flex;
    border-radius: 15px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 6.5em 0 0;
`

const Calendar_Year_Month_Containers = styled.div`
    height: 100%;
    width: 15%;
    background-color: #FA991D;
`

const Calendar_Year_Containers = styled.div`
    width: 100%;
    height: 100px;
    display:flex;
    justify-content: center;
    align-items: center;
`

const Calendar_Year_Prev_btn = styled(ArrowIosBackOutline)`
    width:32px;
    height:32px;
    color:white;
    cursor: pointer;

    &:hover{
        color:#052439;
    }
`

const Calendar_Year_Next_btn = styled(ArrowIosForwardOutline)`
    width:32px;
    height:32px;
    color:white;
    cursor: pointer;

    &:hover{
        color:#052439;
    }
`

const Calendar_Year_Text = styled.span`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    color: white;
    font-size: 2em;
    margin-left: 20px;
    margin-right: 20px;
`

const Calendar_Month_Containers = styled.div`
    width: 100%;
    height: calc(100vh - 380px);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
`

const Calendar_Month_Text = styled.span`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    color: white;
    cursor: pointer;

    &:hover{
        color:#052439;
    }
`

const Calendar_Month_Footer = styled.div`
    width:100%;
    height:30px;
`

const Calendar_Day_Containers = styled.div`
    width: 60%;
    height: 100%;
    display:flex;
    align-items: center;
    background-color: #052439;
`

const Calendar_Day_Inside_Containers = styled.div`
    width: 100%;
    height: 100%;
`

const Calendar_Days_Title_Containers = styled.div`
    width: 100%;
    display:flex;
    font-size: 0.5em;
    box-sizing: border-box;
    padding: 1em 2em 2em;
    justify-content: center;
    align-items: center;
`
const Calendar_Days_Title = styled.span`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 4em;
    color: white;
`

const Calendar_Days_Text_Containers = styled.div`
    width:100%;
    height: 0.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 40px;
`
const Calendar_Days_Text = styled.span`
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 2em;
    color: white;
`

const Calendar_Day_Body_Containers = styled.div`
    width:100%;
    height:700px;
    display:flex;
    flex-flow: row wrap;
    align-content: space-around;
`

const Calendar_Day_Text_Containers = styled.div`
    width: calc(100%/7);
    height: 20px;
`

const Calendar_Day_Text = styled.div`
    color: white;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 1.5em;
    text-align: center;
    opacity: ${props => props.condition ? '.3' : 'none'}; 
`

const Calendar_Text_Containers = styled.div`
    width: 30%;
    height: 100%;
    display:flex;
    justify-content: center;
    align-items: center;
    background-color:#FA991D;
`

const Calendar_Text = styled.div`
    color: white;
    font-family: 'Roboto';
    font-style: normal;
    font-weight: 700;
    font-size: 1.5em;
`
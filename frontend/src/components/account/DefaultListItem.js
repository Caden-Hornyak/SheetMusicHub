import React, { useState, useEffect } from 'react'
import './DefaultListItem.css'
import { BiBarChartAlt } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';


const DefaultListItem = ({ list, files=[], DefaultIcon=<BiBarChartAlt />, header='', text='', url='/'}) => {
    let navigate = useNavigate()
    console.log(list)
  return (
    <>
        {list && list.map(item => {
            let chosen_image = null;
            if (files !== '') {
                for (let file in list[files]) {
                    if (file.type == 'image') {
                        chosen_image = file
                    }
                }
            }
            return (
                <div className='defaultlistitem-wrapper' onClick={() => navigate(url+item['id'])}>
                    <div className='defaultlistitem-left'>
                    {chosen_image ? 
                        <img src={URL.createObjectURL(chosen_image)}></img>
                        :
                        <>
                        {DefaultIcon}
                        </>
                        }
                    </div>
                    <div className='defaultlistitem-right'>
                        {header && <h3>{item[header]}</h3>}
                        {text && <p>{item[text]}</p>}
                    </div>
                </div>
            )
        })}
    </>
  )
}

export default DefaultListItem
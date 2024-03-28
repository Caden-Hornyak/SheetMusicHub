import React, { useState, useEffect } from 'react'
import './DefaultListItem.css'
import { BiBarChartAlt } from "react-icons/bi"
import { useNavigate } from 'react-router-dom'


const DefaultListItem = ({ list, DefaultIcon=<BiBarChartAlt />, header='', text='', id='id', url='/', files='files', selection=null}) => {
    let navigate = useNavigate()

    let [highlights, set_highlights] = useState({})

    useEffect(() => {
        if (selection !== null) {
            selection.current = highlights
        }
    }, [highlights])

  return (
    <>
        {list.length > 0 && list.map(item => {
            let chosen_image = null

            for (let file_key in item[files]) {
                let file = item[files][file_key]
                console.log(file)
                if (file.type == 'image') {
                    chosen_image = file.file
                }
            }
            
            return (
                <div key={item.id} className='defaultlistitem-wrapper' style={{backgroundColor: item.id in highlights ? 'rgba(255, 255, 255, 0.3)' : undefined}}
                onClick={selection === null ? () => navigate(url+item[id]) : () => set_highlights(prev_state => ({...prev_state, [item.id]: true}))}>
                    <div className='defaultlistitem-left'>
                    {chosen_image ? 
                        <img src={chosen_image}></img>
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
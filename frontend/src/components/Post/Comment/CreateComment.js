import React, { useState } from 'react'
import axios from '../../../configs/axiosConfig'
import Cookies from 'js-cookie'
import './CreateComment.css'

const CreateComment = ({ object_type, object_id, update_object, par_state, close_reply, written_text, setwritten_text}) => {

  let create_comment = async () => {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken')
        }
    };

    const body = JSON.stringify({
        'withCredentials': true,
        'object_type': object_type,
        'text': written_text,
        'object_id': object_id
    })

    try {

        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/comments/create-comment/`, body, config);

        if (res.data.error) {
            console.log(res.data.error)
        } else {
          if (object_type === 'Comment') {
            update_object({...par_state, child_comment: par_state.child_comment.concat(res.data.comment)})
          } else {
            update_object({...par_state, comments: par_state.concat(res.data.comment)})
          }
            
            setwritten_text('')
            close_reply(false)
        }

    } catch (err) {
        console.log(err)
    }
  }

  return (
    <div id='create-cmt-wrapper'>
      <div id='reply-cont'>
        <textarea placeholder="Comment" onChange={(e) => setwritten_text(e.target.value)} defaultValue={written_text} ></textarea>
        <div id="comment-reply-lower" >
          <button className="comment-reply-buttons" onClick={() => close_reply(false)}
          style={{marginLeft: 'auto'}} >Close</button>
          <button className={`comment-reply-buttons ${written_text === '' ? 'disabled' : ''}`} onClick={() => create_comment(written_text)} disabled={written_text === ''} >Send</button>
        </div>
      </div>
      <div id="endbar-deco">
        <div id='thin-line' ></div>
        <div id='thick-line' ></div>
      </div>
    </div>
  )
}

export default CreateComment
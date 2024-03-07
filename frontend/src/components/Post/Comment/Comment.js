import React, { useState } from 'react'
import LikeDislike from '../LikeDislike'
import RelativeTime from '../RelativeTime'
import CreateComment from './CreateComment'
import './Comment.css'
import { BiUpArrowAlt } from "react-icons/bi";



const Comment = ({ comment, getComments, thread_style }) => {

    
    let [curr_comment, setcurr_comment] = useState(comment)
    let [comment_clicked, setcomment_clicked] = useState(false)
    let child_comment = curr_comment['child_comment']

    let [thread, setThread] = useState(true)

    const close_thread_style = {
      display: thread ? 'flex' : 'none',
    };

    const thread_closed = {
      borderRadius: thread ? '0px': '30px',
      height: thread ? '': '13px',
      width: thread ? '3px' : '13px'
    }

    let close_thread = () => {
      setThread(!thread)
    }

  return (
    <div style={thread_style} className='comment'>
      <div className='comment-thread' style={thread_closed} onClick={() => close_thread()} ></div>
      <div>
        <div>
          <span><img src='#'></img></span>
          <span id='comment-name' >{curr_comment['poster']}</span>
          <RelativeTime object_date={curr_comment.date_created}/>
        </div>
        <div className='toggle-div' style={close_thread_style}>
          <p>{curr_comment['text']}</p> 
          <div>
            <LikeDislike object="comment" object_id={curr_comment.id} likes={curr_comment.likes} user_vote={curr_comment.user_vote}/>

            <button onClick={() => setcomment_clicked(!comment_clicked)} >Comment <BiUpArrowAlt /></button>
            {comment_clicked ? <CreateComment object_type={'Comment'} object_id={curr_comment.id} update_object={setcurr_comment} par_state={curr_comment} close_thread_style_reply={setcomment_clicked} /> : <></> }
          </div>
          { child_comment.length > 0 && (getComments(child_comment))}
        </div>
      </div>
    </div>
  )
}

export default Comment
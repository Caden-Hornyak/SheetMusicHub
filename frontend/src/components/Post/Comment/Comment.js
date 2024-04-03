import React, { useState } from 'react'
import LikeDislike from '../LikeDislike'
import RelativeTime from '../RelativeTime'
import CreateComment from './CreateComment'
import './Comment.css'
import { BiUpArrowAlt } from "react-icons/bi";



const Comment = ({ comment, getComments, thread_style }) => {

    let [curr_comment, setcurr_comment] = useState(comment)
    let [comment_clicked, setcomment_clicked] = useState(false)
    let child_comment = curr_comment.child_comment

    let [written_text_comment, setwritten_text_comment] = useState("") // reply text
    let [thread, setThread] = useState(true)

    const close_thread_style = {
      transition: 'height ease 10s',
      display: thread ? 'block' : 'none'
    }

    const thread_closed = {
      borderRadius: thread ? '0px': '30px',
      height: thread ? '': '13px',
      width: thread ? '3px' : '13px',
      margin: thread ? undefined : '10px'
      // marginRight: thread ? '': '5px',
      // marginLeft: thread ? '': '0px'
    }

    let close_thread = () => {
      setThread(!thread)
    } 

    const comment_hier_margin = {
      marginLeft: `4px`
    }

  return (
    <div style={{...thread_style, ...comment_hier_margin}} className='comment'>
      <div className='upper-comment'>
          {!thread && <div id='thread-container' onClick={() => close_thread()}><div className='comment-thread' style={thread_closed}  ></div></div>}
          <div id='comment-image'><img src={comment.poster.profile_picture} style={{borderRadius: '50px'}}></img></div>
          <div id='comment-name' >{curr_comment.poster.username}</div>
          <div><RelativeTime object_date={curr_comment.date_created}/></div>
      </div>
      <div className='lower-comment'>
        { thread && <div id='thread-container' onClick={() => close_thread()}><div className='comment-thread' style={thread_closed}  ></div></div>}
        <div id="comment-body">
          <div className='toggle-div' style={close_thread_style}>
            <p id="comment-text" >{curr_comment.text}</p> 
            <div id='comment-btn'>
              <LikeDislike object="comment" object_id={curr_comment.id} likes={curr_comment.likes} user_vote={curr_comment.user_vote}/>

              <button className="comment-button" onClick={() => setcomment_clicked(!comment_clicked)} >Comment <BiUpArrowAlt /></button>
            </div>
            {comment_clicked && <CreateComment object_type='Comment' object_id={curr_comment.id} 
            update_object={setcurr_comment} par_state={curr_comment} close_reply={setcomment_clicked} 
            written_text={written_text_comment} setwritten_text={setwritten_text_comment} />}

            { child_comment.length > 0 && (getComments(child_comment))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comment
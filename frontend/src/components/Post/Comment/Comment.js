import React, { useState } from 'react'
import LikeDislike from '../LikeDislike'
import RelativeTime from '../RelativeTime'
import CreateComment from './CreateComment'
import './Comment.css'
import { BiUpArrowAlt } from "react-icons/bi";



const Comment = ({ comment, getComments }) => {

    
    let [curr_comment, setcurr_comment] = useState(comment)

    let [comment_clicked, setcomment_clicked] = useState(false)

    let child_comment = curr_comment['child_comment']

  return (
    <div className='comment'>
        <div>
          <span>{curr_comment['poster']}</span>
          <RelativeTime object_date={curr_comment.date_created}/>
        </div>
        <p>{curr_comment['text']}</p> 
        <div>
          <LikeDislike object="comment" object_id={curr_comment.id} likes={curr_comment.likes} user_vote={curr_comment.user_vote}/>
          <button onClick={() => setcomment_clicked(!comment_clicked)} >Comment <BiUpArrowAlt /></button>
          {comment_clicked ? <CreateComment object_type={'Comment'} object_id={curr_comment.id} update_comment={setcurr_comment} par_comment_state={curr_comment} close_reply={setcomment_clicked} /> : <></> }
        </div>
        { child_comment.length > 0 && (getComments(child_comment))}
    </div>
  )
}

export default Comment
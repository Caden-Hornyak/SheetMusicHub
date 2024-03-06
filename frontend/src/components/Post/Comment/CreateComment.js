import React, { useState } from 'react'
import axios from '../../../configs/axiosConfig'
import Cookies from 'js-cookie'

const CreateComment = ({ object_type, object_id, update_comment, par_comment_state, close_reply }) => {

  let [written_text, setwritten_text] = useState("")



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
            update_comment({...par_comment_state, child_comment: par_comment_state.child_comment.concat(res.data.comment)})
            setwritten_text('')
            close_reply()
        }

    } catch (err) {
        console.log(err)
    }
  }

  return (
    <div>
      <textarea onChange={(e) => setwritten_text(e.target.value)} ></textarea>
      <button onClick={() => create_comment(written_text)}>Send</button>
    </div>
  )
}

export default CreateComment
import React, { useState, useEffect } from 'react'
import { BiLike, BiDislike } from "react-icons/bi";
import Cookies from 'js-cookie'
import axios from '../../configs/axiosConfig'
import './LikeDislike.css'

const LikeDislike = ({ object, object_id, likes }) => {
    
    let [curr_likes, setcurr_likes] = useState(likes)
    let [liked, setliked] = useState(false)
    let [disliked, setdisliked] = useState(false)

    useEffect(() => {
        // This effect will run whenever the 'likes' prop changes
        setcurr_likes(likes);
      }, [likes]);

    let alterlikes = async (value, vote) => {
        let res;

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            }
        };
    
        const body = JSON.stringify({ value });

        try {
            // call patch for object (comment or post)
            res = await axios.post(`${process.env.REACT_APP_API_URL}/api/votes/${object}/${object_id}`, body, config);
            
            if (res.data.error) {
                console.log(res.data.error)
            } else {
                setcurr_likes(prevLikes => prevLikes+res.data.update)

                // handles button colors
                if (vote == 'like') {
                    setliked(!liked)
                    setdisliked(false)
                } else {
                    setdisliked(!disliked)
                    setliked(false)
                }
                
            }
        } catch (err) {
            console.log(err);
        }
    }


  return (
    <span>
        <span>{curr_likes}</span>
        <BiLike className={liked ? 'like-btn-active': 'like-btn'} onClick={() => alterlikes(1, 'like')}/>
        <BiDislike className={disliked ? 'dislike-btn-active': 'dislike-btn'} onClick={() => alterlikes(-1, 'dislike')}/>
    </span>
    
  )
}

export default LikeDislike
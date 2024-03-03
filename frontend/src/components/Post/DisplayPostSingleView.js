import React, { useEffect, useState } from 'react'
import axios from '../../configs/axiosConfig'
import { BiLike, BiDislike } from "react-icons/bi";

const DisplayPostSingleView = (props) => {
    let postid = props.postid
    
    let [post, setPost] = useState({
        title: '',
        images: {0: ''},
    })

    let [postExists, setPostExists] = useState(false);

    let getPost = async () => {
        let res;

        try {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postid}`);
            
            if (res.data.error) {
                console.log("Post not found")
            } else {
                setPost({...post, title: res.data.title, images: res.data.images })

                setPostExists(true)
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPost()
    }, [])
    
  return (
    <div>
        { postExists &&
        <div className='singlepost-wrapper'>
            <div className="singlepost-post">
                <h3>{post.title}</h3>
                <img src={process.env.REACT_APP_API_URL+post.images[0].image}></img>
                <div>
                    <BiLike className='like-btn' />
                    <BiDislike className='dislike-btn' />
                </div>
            </div>
        </div>}

        { !postExists && <h1>Post does not exist</h1>}
    </div>
  )
}

export default DisplayPostSingleView
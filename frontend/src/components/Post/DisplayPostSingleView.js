import React, { useEffect, useState } from 'react'
import axios from '../../configs/axiosConfig'
import LikeDislike from './LikeDislike'
import { BiLike, BiDislike } from "react-icons/bi";
import './DisplayPostSingleView.css'

const DisplayPostSingleView = (props) => {
    let postid = props.postid
    
    let [post, setPost] = useState({
        title: '',
        images: {0: ''},
        comments: [{ child_comment: [], text: "", likes: 0 }],
        likes: 0,
        id: '-'
    })

    let [comment, setComment] = useState({

    })

    let getPost = async () => {
        let res;

        try {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postid}`);
            console.log(res.data)
            
            if (res.data.error) {
                console.log("Post not found")
            } else {
                setPost({...post, title: res.data.title, images: res.data.images, 
                        comments: res.data.comments, likes: res.data.likes, 
                        id: res.data.id })
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPost()
    }, [])

    let createComments = (create_comment) => {

        const createCommentMap = create_comment.map((curr_comment) => {
            let child_comment = curr_comment['child_comment']
            
            return (
                <div className='comment'>
                    <p>{curr_comment['text']}<LikeDislike object="comment" object_id={curr_comment.id} likes={curr_comment.likes}/></p> 
                    { child_comment.length > 0 && (createComments(child_comment))}
                </div>
            )
        });
        return createCommentMap
    }
    
  return (
        <div className='singlepost-wrapper'>
            <div className="singlepost-post-wrapper">
                <div><h3>{post.title}</h3></div>
                <img src={process.env.REACT_APP_API_URL+post.images[0].image}></img>
                <div>
                    <LikeDislike object="post" object_id={post.id} likes={post.likes}/>
                </div>
            </div>
            <div className="singlepost-comments-wrapper">
                {/* {console.log(post)} */}
                {createComments(post.comments)}
            </div>
        </div>
  )
}

export default DisplayPostSingleView
import React, { useEffect, useState } from 'react'
import axios from '../../configs/axiosConfig'
import { BiLike, BiDislike } from "react-icons/bi";

const DisplayPostSingleView = (props) => {
    let postid = props.postid
    
    let [post, setPost] = useState({
        title: '',
        images: {0: ''},
        comments: {0: ''}
    })

    let getPost = async () => {
        let res;

        try {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${postid}`);
            
            if (res.data.error) {
                console.log("Post not found")
            } else {
                setPost({...post, title: res.data.title, images: res.data.images, comments: res.data.comments })
                console.log(post)
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getPost()
    }, [])

    // let createComments = (comment) => {
    //     if (comment.child_comment.length == 0) {
    //         return
    //     }

    //     return (
    //         <div>
    //             <p>{comment.text}</p>
    //             {createComments(comment.child_comment)}
    //         </div>
    //     )
    // }
    
  return (
    <div>
        <div className='singlepost-wrapper'>
            <div className="singlepost-post">
                <h3>{post.title}</h3>
                <img src={process.env.REACT_APP_API_URL+post.images[0].image}></img>
                <div>
                    <BiLike className='like-btn' />
                    <BiDislike className='dislike-btn' />
                </div>
            </div>
            <div className="singlepost-comments-wrapper">
                {/* {createComments(post.comments)} */}
            </div>
        </div>

    </div>
  )
}

export default DisplayPostSingleView
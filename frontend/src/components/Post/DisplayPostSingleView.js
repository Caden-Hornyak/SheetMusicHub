import React, { useEffect, useState } from 'react'
import axios from '../../configs/axiosConfig'
import LikeDislike from './LikeDislike'
import { BiLike, BiDislike, BiArrowBack } from "react-icons/bi";
import './DisplayPostSingleView.css'
import { useNavigate } from 'react-router-dom';
import Comment from './Comment/Comment'
import Cookies from 'js-cookie'
import RelativeTime from './RelativeTime'

const DisplayPostSingleView = (props) => {

    let post_id = props.postid
    let navigate = useNavigate();
    
    let [post, setPost] = useState({
        title: '',
        images: {0: ''},
        comments: [{ child_comment: [], text: "", likes: 0 }],
        likes: 0,
        id: '-',
        user_vote: 0,
        date_created: '-'
    })


    let goBack = () => {
        navigate('/')
    }

    useEffect(() => {
        getPost()
    }, [])

    let getPost = async () => {
        let res;

        try {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${post_id}`);
            
            if (res.data.error) {
                console.log("Post not found")
            } else {
                setPost({...post, title: res.data.title, images: res.data.images, 
                        comments: res.data.comments, likes: res.data.likes, 
                        id: res.data.id, user_vote: res.data.user_vote, 
                        date_created: res.data.date_created })
            }
        } catch (err) {
            console.log(err);
        }
    }

    let getComments = (create_comment) => {

        const getCommentMap = create_comment.map((curr_comment) => {
            return (
                <Comment key={curr_comment.id} comment={curr_comment} getComments={getComments} />
            )
        });
        return getCommentMap
    }

    
    
  return (
    <div className='singlepost-body'>
        <div className='singlepost-wrapper'>
            <BiArrowBack onClick={() => goBack()}/>
            <div className="singlepost-post-wrapper">
                <div><h3>{post.title}</h3></div>
                <div><RelativeTime object_date={post.date_created}/></div>
                <img src={post.images[0].image}></img>
                <div>
                    <LikeDislike object="post" object_id={post.id} likes={post.likes} user_vote={post.user_vote}/>
                </div>
                <textarea></textarea>
                <button >Reply</button>
            </div>
            <div className="singlepost-comments-wrapper">
                {getComments(post.comments)}
            </div>
        </div>
    </div>
  )
}

export default DisplayPostSingleView
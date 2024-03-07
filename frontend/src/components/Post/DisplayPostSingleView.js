import React, { useEffect, useState } from 'react'
import axios from '../../configs/axiosConfig'
import LikeDislike from './LikeDislike'
import { BiArrowBack, BiUpArrowAlt } from "react-icons/bi";
import './DisplayPostSingleView.css'
import { useNavigate } from 'react-router-dom';
import Comment from './Comment/Comment'
import RelativeTime from './RelativeTime'
import CreateComment from './Comment/CreateComment'

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
        date_created: '-',
        description: '',
        poster: "User Not Found"
    })

    let [post_comments, setpost_comments] = useState({
        comments: [{ child_comment: [], text: "", likes: 0 }]
    })

    let [postreply_clicked, setpostreply_clicked] = useState(false)

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
                        likes: res.data.likes, 
                        id: res.data.id, user_vote: res.data.user_vote, 
                        date_created: res.data.date_created, description: res.data.description,
                        poster: res.data.poster })
                setpost_comments({...post_comments, comments: res.data.comments})
                console.log(post)
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

    const no_desc_styling = {
        justifyContent: post.description === '' ? "center": '' 
    }

  return (
    <div className='singlepost-body'>
        <img className='background' src={post.images[0].image} alt="Sheet Music"></img>
            <BiArrowBack className='back-arrow' onClick={() => goBack()}/>
            <div className="singlepost-post-wrapper">
                <div id='singlepost-upper' >
                    <div id='singlepost-title' >{post.title}</div>
                    <div id='date-and-user'>
                        <span>Posted <RelativeTime object_date={post.date_created}/></span>
                        <span id='singlepost-poster'>by {post.poster}</span>
                    </div>
                    
                </div>
                <div className='post-content' style={no_desc_styling}>
                    <img src={post.images[0].image} alt="Sheet Music"></img>
                    
                </div>
                
                <div id='singlepost-lower' >
                    <LikeDislike object="post" object_id={post.id} likes={post.likes} user_vote={post.user_vote}/>

                    <button id='post-cmt-btn' onClick={() => setpostreply_clicked(!postreply_clicked)} >Comment <BiUpArrowAlt /></button>
                    {postreply_clicked ? <CreateComment key={post.id} object_type={'Post'} object_id={post.id} 
                    update_object={setpost_comments} par_state={post_comments.comments} close_reply={setpostreply_clicked} /> : <></> }
                </div>
                <hr />
                { post.description == '' ? <p>No Post Description :(</p> : <p>{post.description}</p>}
            </div>
        <div className="singlepost-comments-wrapper">
                {getComments(post_comments.comments)}
        </div>
    </div>
  )
}

export default DisplayPostSingleView
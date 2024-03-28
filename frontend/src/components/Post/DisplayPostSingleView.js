import React, { useEffect, useState } from 'react'
import axios from '../../configs/axiosConfig'
import LikeDislike from './LikeDislike'
import { BiArrowBack, BiUpArrowAlt } from "react-icons/bi"
import './DisplayPostSingleView.css'
import { useNavigate } from 'react-router-dom'
import Comment from './Comment/Comment'
import RelativeTime from './RelativeTime'
import CreateComment from './Comment/CreateComment'
import FileViewer from '../utility/FileViewer'
import def_back from '../../images/default_sp_background.jpg'
import { default_ajax } from '../../utility/CommonFunctions'

const DisplayPostSingleView = (props) => {

    let post_id = props.postid
    let navigate = useNavigate();
    
    let [post, setPost] = useState({
        title: '',
        files: [],
        likes: 0,
        id: '-',
        user_vote: 0,
        date_created: '-',
        description: '',
        poster: "User Not Found"
    })

    let [post_comments, setpost_comments] = useState([])

    let [background, set_background] = useState(def_back)
    let [postreply_clicked, setpostreply_clicked] = useState(false)
    let [written_text_post, setwritten_text_post] = useState("") // reply text

    let goBack = () => {
        navigate('/')
    }

    useEffect(() => {
        getPost()
    }, [])

    useEffect(() => {
        if (post.files.length > 0) {
            for (let file_key in post.files) {
                if (post.files[file_key].type == 'image') {
                    set_background(post.files[file_key].file)
                }
            }
            
        }
    }, [post])

    let getPost = async () => {
        let res = await default_ajax('get', `posts/${post_id}`)

        if (res === -1) {
            console.log(res)
        } else {
            let cleaned_songs = res.songs
            for (let song_key in cleaned_songs) {
                cleaned_songs[song_key].type = 'song'
                cleaned_songs[song_key].order = 0
            }

            setPost({...post, title: res.title, images: res.images, 
                likes: res.likes, id: res.id, user_vote: res.user_vote, 
                date_created: res.date_created, description: res.description,
                poster: res.poster, songs: res.songs,
                // display files in order they were saved, put songs at end
                files: [...res.pdf_files, ...res.videos, ...res.images, ...cleaned_songs].sort((a, b) => (a.order || 0) - (b.order || 0)) })
        setpost_comments({...post_comments, comments: res.comments})
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
    <div className='final-container'>
        <BiArrowBack className='back-arrow' onClick={() => goBack()}/>
        <div className='singlepost-body'>
            <img className='background' src={background} alt="Sheet Music"></img>
            <div className="singlepost-post-wrapper">
                <div className='singlepost-post'>
                    <div id='singlepost-upper' >
                        <div id='singlepost-title' >{post.title}</div>
                        <div id='date-and-user'>
                            <span style={{color: 'rgba(255, 255, 255, 0.3)'}}>Posted <RelativeTime object_date={post.date_created} /> by {post.poster.username}</span>
                        </div>
                        
                    </div>
                    {post.files.length !== 0 &&
                        <div className='post-content' >
                            <FileViewer uploaded_files={post.files} />   
                        </div>
                    }
                    
                    { post.description == '' ? <p id='post-description'>No Post Description :(</p> : <p id='post-description'>{post.description}</p>}
                    <hr />
                    <div id='singlepost-lower' >
                        <LikeDislike object="post" object_id={post.id} likes={post.likes} user_vote={post.user_vote}/>

                        <button id='post-cmt-btn' className="comment-button" onClick={() => setpostreply_clicked(!postreply_clicked)} >Comment <BiUpArrowAlt /></button>
                        
                    </div>
                    {postreply_clicked && <CreateComment key={post.id} object_type='Post' object_id={post.id} 
                    update_object={setpost_comments} par_state={post_comments.comments} close_reply={setpostreply_clicked} 
                    written_text={written_text_post} setwritten_text={setwritten_text_post}/>}
                </div>
                

                
                <div className="singlepost-comments-wrapper">
                    {post_comments.length === 0 ?
                        <div>This post has no comments</div>
                    :
                        getComments(post_comments.comments)
                    }
                </div>
            </div>
            
        </div>
    </div>
  )
}

export default DisplayPostSingleView
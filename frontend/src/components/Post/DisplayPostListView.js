import React, { useState, useEffect, useRef } from 'react'
import axios from '../../configs/axiosConfig'
import { BiLike, BiDislike } from "react-icons/bi"
import './DisplayPostListView.css'
import { useNavigate } from 'react-router-dom'
import FileViewer from '../FileViewer'
import { attribute_animation } from '../../utility/CommonFunctions.js'
import LikeDislike from './LikeDislike.js'
import RelativeTime from './RelativeTime.js'
import { BiComment } from "react-icons/bi"
import { FaRegBookmark } from "react-icons/fa6"
import { newtonsCradle } from 'ldrs'
import { default_ajax } from '../../utility/CommonFunctions.js'

function DisplayPostListView({ lvh }) {

    // resize page on navbar hide/unhide
    let listview_ref = useRef(null)
    useEffect(() => {
        if (listview_ref.current && lvh !== null) {
            if (lvh) {
                console.log('hello')
                attribute_animation(listview_ref.current, 'height', '100vh', 'calc(100vh - var(--navbar-height))', 500, 'ease-in')
                attribute_animation(listview_ref.current, 'top', '0', 'var(--navbar-height)', 500, 'ease-in')
            } else {
                console.log('hello')
                attribute_animation(listview_ref.current, 'height', 'calc(100vh - var(--navbar-height))', '100vh', 500, 'ease-out')
                attribute_animation(listview_ref.current, 'top', 'var(--navbar-height)', '0', 500, 'ease-out')
            }
        }
    }, [lvh])

    let [posts, setPosts] = useState(null)

    let navigate = useNavigate();
    
    let getPosts = async () => {
        let res = await default_ajax('get', 'posts/multiple')
        
        if (res !== -1) {
            if (res.length !== 0) {

                setPosts(
                    (res).map(post => (
                        {
                            title: post.title,
                            files: [...post.images, ...post.pdf_files, ...post.videos],
                            likes: post.likes,
                            id: post.id,
                            user_vote: post.user_vote,
                            date_created: post.date_created,
                            description: post.description,
                            poster: post.poster,
                            comment_count: post.comment_count
                        }
                    
                )))
            }
        }

    }

    const viewPost = (post) => {
        
        navigate(`/posts/${post.id}`)
    }

    useEffect(() => {
        getPosts()
        newtonsCradle.register()
    }, [])

    // useEffect(() => {
    //     console.log(posts)
    // }, [posts])
    

    return(
        <div className='postlistview' ref={listview_ref} style={(posts && posts.length) ? {}: {display: 'flex', justifyContent: 'center'} } >
            { posts === null ? 
            <div>
                <l-newtons-cradle
              size="150"
              speed="1.4" 
              color="var(--text-color)" 
              className='listview-loader'
                />
                
            </div>
            :
            posts.length === 0 ?
            <div>
                <h1>No posts were found</h1>
            </div>
            : 
            posts.map((post) => (
                <div className='postlistview-post-wrapper' key={post.id}>
                    <div className='postlistview-post' onClick={() => viewPost(post)}>
                        <div className='postlistview-upperpost'>
                            <h2>{post.title}</h2>
                            <span>Posted by {post.poster} <RelativeTime object_date={post.date_created} /></span>
                        </div>
                        <div className='postlistview-fileviewer'>
                            {post.files.length !== 0 && <FileViewer uploaded_files={post.files}/>}
                        </div>
                        {post.description && 
                        <p className='postlistview-description'>
                            {post.description.length < 300 ? post.description : post.description.slice(0, 200)+'...'}
                        </p>}
                        <div className='postlistview-lowerpost'>
                            <LikeDislike object="post" object_id={post.id} likes={post.likes} user_vote={post.user_vote}/>
                            <button ><BiComment /> {post.comment_count} comments</button>
                            <button ><FaRegBookmark /> Bookmark</button>
                        </div>
                    </div>
                </div>
            
            ))}
        </div>
    );
}

export default DisplayPostListView
import React, { useState, useEffect, useRef } from 'react'
import axios from '../../configs/axiosConfig'
import { BiLike, BiDislike } from "react-icons/bi"
import './DisplayPostListView.css'
import { useNavigate } from 'react-router-dom'
import FileViewer from '../FileViewer'
import { attribute_animation } from '../../utility/Animations.js'
import LikeDislike from './LikeDislike.js'
import RelativeTime from './RelativeTime.js'
import { BiComment } from "react-icons/bi"
import { FaRegBookmark } from "react-icons/fa6"




function DisplayPostListView({ lvh }) {

    // resize page on navbar hide/unhide
    let listview_ref = useRef(null)
    useEffect(() => {
        console.log(lvh)
        if (listview_ref.current && lvh !== null) {
            if (lvh) {
                attribute_animation(listview_ref.current, 'height', '100vh', 'calc(100vh - var(--navbar-height))', 500, 'ease-in')
                attribute_animation(listview_ref.current, 'top', '0', 'var(--navbar-height)', 500, 'ease-in')
            } else {
                attribute_animation(listview_ref.current, 'height', 'calc(100vh - var(--navbar-height))', '100vh', 500, 'ease-out')
                attribute_animation(listview_ref.current, 'top', 'var(--navbar-height)', '0', 500, 'ease-out')
            }
        }
    }, [lvh])

    let [posts, setPosts] = useState([{
        title: '',
        files: [],
        likes: 0,
        id: '-',
        user_vote: 0,
        date_created: '-',
        description: '',
        poster: "User Not Found"
    }])

    let navigate = useNavigate();
    
    let getPosts = async () => {
        let data;
        let res;

        try {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/multiple`);

            if (res.data.error) {
                console.log(res.data.error)
            } else {
                if (res.data.length !== 0) {
                    console.log(res.data)

                    setPosts(
                        (res.data).map(post => (
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
        
        } catch (err) {
            console.log(err);
        }
    }

    const viewPost = (post) => {
        
        navigate(`/posts/${post.id}`)
    }

    // TODO Fix list view and give this page some time anyhow
    let create_post = (post) => {

        return (
            <div className='postlistview-post-wrapper'>
                <div key={post.id} className='postlistview-post' onClick={() => viewPost(post)}>
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
        )
        
    }

    let create_rows = () => {
        let row_array = [];
        for (let i = 0; i < posts.length; i++) {
            row_array.push(
                create_post(posts[i])
            )
        }
        return row_array
    }

    useEffect(() => {
        getPosts()
    }, [])

    useEffect(() => {
        console.log(posts)
    }, [posts])

    return(
        <div className='postlistview' ref={listview_ref} >
            { posts.length === 0 ? <h1>No posts were found</h1> : create_rows()}
        </div>
    );
}

export default DisplayPostListView
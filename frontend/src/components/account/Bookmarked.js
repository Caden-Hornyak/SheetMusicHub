import React, { useState, useEffect } from 'react'
import './Profile.css'
import { default_ajax } from '../../utility/CommonFunctions.js'
import DefaultListItem from './DefaultListItem.js'
import { BiCommentDetail } from "react-icons/bi";
import { BsBodyText } from "react-icons/bs";
import { LuListMusic } from "react-icons/lu";
import './Bookmarked.css'
import { dotPulse } from 'ldrs'


const Bookmarked = () => {

    let [bookmarked_posts, set_bookmarked_posts] = useState(null)
    let [bookmarked_comments, set_bookmarked_comments] = useState(null)
    let [visibilities, set_visibilities] = useState([true, false])

    let get_posts = async () => {
        let res = await default_ajax('get', 'bookmarks/post')
        console.log(res)
        set_bookmarked_posts(res)
    }

    let get_comments = async () => {
        let res = await default_ajax('get', 'bookmarks/comment')
        set_bookmarked_comments(res)
    }


    useEffect(() => {
        get_posts()
        dotPulse.register()
    }, [])

  return (
    <div id='bookmarked-component'>
        <div id='bookmarked-topbar'>
            <button className={`bookmark-topbar-btn ${visibilities[0] ? 'active': ''}`}
            onClick={() => {get_posts(); set_visibilities([true, false])}}>Posts</button>
            <button className={`bookmark-topbar-btn ${visibilities[1] ? 'active': ''}`}
            onClick={() => {get_comments(); set_visibilities([false, true])}}>Comments</button>
        </div>
        <div id='bookmarked-tabs'>
            {visibilities[0] &&
                <div id='bookmarked-posttab' >
                    {!bookmarked_posts ? 
                    <p>{<l-dot-pulse
                    size="43"
                    speed="1.3" 
                    color="black" 
                    ></l-dot-pulse>}</p>
                    :
                    bookmarked_posts.length === 0 ?
                    <p>You have no bookmarked posts</p>
                    :
                    bookmarked_posts === -1 ?
                    <p>Error getting bookmarked posts</p>
                    :
                    <DefaultListItem list={bookmarked_posts} files='images' 
                    DefaultIcon={<BsBodyText />} header='title' text='description'
                    url='/posts/'
                    />
                    }
                </div>}
            {visibilities[1] &&
                <div id='bookmarked-commenttab' >
                {!bookmarked_comments ? 
                <p>{<l-dot-pulse
                size="43"
                speed="1.3" 
                color="black" 
                ></l-dot-pulse>}</p>
                :
                bookmarked_comments.length === 0 ?
                <p>You have no bookmarked comments</p>
                :
                bookmarked_comments === -1 ?
                <p>Error getting bookmarked comments</p>
                :
                <DefaultListItem list={bookmarked_posts} files='files' 
                    DefaultIcon={<BiCommentDetail />} header='title' text='description'
                    url='/comments/'
                    />
                }
            </div>}
            
        </div>
    </div>
  )
}

export default Bookmarked
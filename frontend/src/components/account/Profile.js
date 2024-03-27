import React, { useState, useEffect } from 'react'
import './Profile.css'
import { default_ajax } from '../../utility/CommonFunctions.js'
import DefaultListItem from './DefaultListItem.js'
import { BiCommentDetail } from "react-icons/bi";
import { BsBodyText } from "react-icons/bs";
import { LuListMusic } from "react-icons/lu";
import { dotPulse } from 'ldrs'


const Profile = () => {

    let [user_posts, set_user_posts] = useState(null)
    let [user_comments, set_user_comments] = useState(null)
    let [user_songs, set_user_songs] = useState(null)
    let [visibilities, set_visibilities] = useState([true, false, false])

    let get_posts = async () => {
        let res = await default_ajax('get', 'posts/multiple')
        set_user_posts(res)
    }

    let get_comments = async () => {
        let res = await default_ajax('get', 'comments/multiple')
        set_user_comments(res)
    }

    let get_songs = async () => {
        let res = await default_ajax('get', 'songs/multiple')
        set_user_songs(res)
    }

    useEffect(() => {
        get_posts()
        dotPulse.register()
    }, [])

  return (
    <div id='profile-component'>
        <div id='profile-topbar'>
            <button className={`profile-topbar-btn ${visibilities[0] ? 'active': ''}`}
            onClick={() => {get_posts(); set_visibilities([true, false, false])}}>Posts</button>
            <button className={`profile-topbar-btn ${visibilities[1] ? 'active': ''}`}
            onClick={() => {get_comments(); set_visibilities([false, true, false])}}>Comments</button>
            <button className={`profile-topbar-btn ${visibilities[2] ? 'active': ''}`}
            onClick={() => {get_songs(); set_visibilities([false, false, true])}}>Songs</button>
        </div>
        <div id='profile-tabs'>
            {visibilities[0] &&
                <div id='profile-posttab' >
                    {!user_posts ? 
                    <p>{<l-dot-pulse
                        size="43"
                        speed="1.3" 
                        color="black" 
                        ></l-dot-pulse>}</p>
                    :
                    user_posts.length === 0 ?
                    <p>You have no posts</p>
                    :
                    user_posts === -1 ?
                    <p>Error getting user posts</p>
                    :
                    <DefaultListItem list={user_posts} files='images' 
                    DefaultIcon={<BsBodyText />} header='title' text='description'
                    url='/posts/'
                    />
                    }
                </div>}
            {visibilities[1] &&
                <div id='profile-commenttab' >
                {!user_comments ? 
                <p>{<l-dot-pulse
                    size="43"
                    speed="1.3" 
                    color="black" 
                    ></l-dot-pulse>}</p>
                :
                user_comments.length === 0 ?
                <p>You have no comments</p>
                :
                user_comments === -1 ?
                <p>Error getting user comments</p>
                :
                <DefaultListItem list={user_posts} files='files'  id='parent_post'
                    DefaultIcon={<BiCommentDetail />} header='title' text='description'
                    url='/posts/'
                    />
                }
            </div>}
            
            {visibilities[2] &&
            <div id='profile-songtab' >
                {!user_songs ? 
                <p>{<l-dot-pulse
                    size="43"
                    speed="1.3" 
                    color="black" 
                    ></l-dot-pulse>}</p>
                :
                user_songs.length === 0 ?
                <p>You have no songs</p>
                :
                user_songs === -1 ?
                <p>Error getting user songs</p>
                :
                <DefaultListItem list={user_songs}
                    DefaultIcon={<LuListMusic />} header='name'
                    url='/songs/'/>
                }
            </div>}
        </div>
    </div>
  )
}

export default Profile
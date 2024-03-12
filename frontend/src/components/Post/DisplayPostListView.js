import React, { useState, useEffect} from 'react';
import axios from '../../configs/axiosConfig';
import { BiLike, BiDislike } from "react-icons/bi";
import './DisplayPostListView.css'
import { useNavigate } from 'react-router-dom';

function DisplayPostListView() {
    
    let [posts, setPosts] = useState([]);
    let [postfailmsg, setPostfailmsg] = useState(false);
    let navigate = useNavigate();
    
    let getPosts = async () => {
        let data;
        let res;

        try {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/multiple`);

            if (res.data.error) {
                setPostfailmsg(true);
            } else {
                console.log(res.data)
                setPosts(res.data)
                
            }
        } catch (err) {
            console.log(err);
            setPostfailmsg(true);
        }
    }

    const viewPost = (post) => {
        
        navigate(`/posts/${post.id}`)
    }

    let post_map = posts.map((post) => (
        <div key={post.id} className="post-listview-ind" onClick={() => viewPost(post)}>
            <h3>{post.title}</h3>
            <img src={process.env.REACT_APP_API_URL+post.images[0].image}></img>
            <div>
                <BiLike className='like-btn' />
                <BiDislike className='dislike-btn' />
            </div>
        </div>
        
    ));

    useEffect(() => {
        getPosts()
    }, [])

    return(
        <div>
            <link rel="stylesheet" href="path/to/boxicons/css/boxicons.min.css" />
            <div className='post-listview'>

                { postfailmsg ? <h1>No posts were found</h1> : post_map}
            </div>
        </div>
    );
}

export default DisplayPostListView
import React, { useState, useEffect} from 'react';
import axios from '../configs/axiosConfig';

function DisplayPostListView() {
    
    let [posts, setPosts] = useState([]);
    let [postfailmsg, setPostfailmsg] = useState(false);

    
    let getPosts = async () => {
        let data;
        let res;

        try {
            res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/`);
            
            if (res.data.error) {
                setPostfailmsg(true);
            } else {
                setPosts(res.data)
            }
        } catch (err) {
            console.log(err);
            setPostfailmsg(true);
        }
    }

    let post_map = posts.map((post, index) => (
        <div>

            <h3 key={index}>{post.title}</h3>
            <img src={process.env.REACT_APP_API_URL+post.images[0].image}></img>
        </div>
        
    ));

    useEffect(() => {
        getPosts()
    }, [])

    return(
        <div>
            <div className='post'>

                { postfailmsg ? <h1>No posts were found</h1> : post_map}
            </div>
        </div>
    );
}

export default DisplayPostListView
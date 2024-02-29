import React, { useState, useEffect} from 'react'

function DisplayPostListView(props) {
    
    let [posts, setPosts] = useState([])

    


    let getPosts = async () => {

        let response = await fetch('posts/')
        let data = response.json();
        console.log(data);
        setPosts(data)
    }

    useEffect(() => {
        getPosts()
    }, [])

    return(
        <div>
            <div className='post'>
                {posts.map((post, index) => (
                    <h3 key={props.index}>{props.title}</h3>
                ))}
            </div>
        </div>
    );
}

export default DisplayPostListView
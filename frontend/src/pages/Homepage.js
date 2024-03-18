import React, { useState, useEffect} from 'react'
import DisplayPostListView from '../components/Post/DisplayPostListView';
import Navbar from '../components/Navbar';

function PostListPage({}) {
    let [listview_fullheight, set_listview_fullheight] = useState(null)
    

    return(
        <>
            <Navbar parent_height_setter={set_listview_fullheight}/>
            <DisplayPostListView lvh={listview_fullheight}/>            
        </>
    );
}

export default PostListPage
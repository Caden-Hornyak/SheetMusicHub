import React, { useState, useEffect} from 'react'
import DisplayPostListView from '../components/Post/DisplayPostListView';
import Navbar from '../components/Navbar';

function PostListPage() {
    
    

    return(
        <div>
            <Navbar />
            <DisplayPostListView />            
        </div>
    );
}

export default PostListPage
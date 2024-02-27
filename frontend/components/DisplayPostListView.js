import React, { useState, useEffect} from 'react'

function DisplayPostListView(props) {
    
    return(
        <div>
            <div className='post'>
                <h3 key={props.index}>{props.title}</h3>
            </div>
        </div>
    );
}

export default DisplayPostListView
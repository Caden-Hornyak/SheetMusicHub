import React from 'react'
import {useParams} from 'react-router-dom'
import DisplayPostSingleView from '../components/Post/DisplayPostSingleView'
import Navbar from '../components/utility/Navbar'

const ViewPostPage = () => {
    const { postid } = useParams()

  return (
    <>
        <Navbar />
        <DisplayPostSingleView postid={postid}/>
    </>
  )
}

export default ViewPostPage
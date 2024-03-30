import React, { useState } from 'react'
import './FileViewer.css'
import { BiLeftArrow, BiRightArrow, BiX } from "react-icons/bi"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import Piano from '../piano/Piano'

const FileViewer = ({ uploaded_files, wipe_upload=null, clamp=false }) => {

  const [current_index, set_current_index] = useState(0)
  const [is_clamp, set_is_clamp] = useState(false)

  const handle_prev_click = (e) => {
    e.stopPropagation()
    set_current_index(prev_state => prev_state - 1)
  }

  const handle_next_click = (e) => {
    e.stopPropagation()
    set_current_index(prev_state => prev_state + 1)
  }

  const get_orig_file_dim = (e) => {
    const { naturalWidth, naturalHeight } = e.target
    if (naturalHeight > 550) {
      set_is_clamp(true)
    }
  }

  return (
    <div className="file-viewer" style={{overflow: clamp ? 'hidden': undefined, maxHeight: clamp ? '550px': undefined}} >
      {wipe_upload && <button onClick={() => wipe_upload(uploaded_files[current_index])} ></button>}
      {current_index !== 0 && <button className='scroll-button' id='prev-img-btn' onClick={(e) => handle_prev_click(e)}><IoIosArrowBack /></button>}
      {uploaded_files[current_index].type == 'image' && <img onLoad={(e) => get_orig_file_dim(e)} src={uploaded_files[current_index].file}></img>}
      {console.log(uploaded_files[current_index])}
      {uploaded_files[current_index].type == 'song' && <Piano type='playback' user_interact={false} song={uploaded_files[current_index].song_notes} />}
      {uploaded_files[current_index].type == 'video' && (
        <video controls width="400" height="300">
          <source src={URL.createObjectURL(uploaded_files[current_index])} type={uploaded_files[current_index].type} />
          Your browser does not support the video tag.
        </video>
      )}
      {uploaded_files[current_index].type == 'pdf' && <iframe src={uploaded_files[current_index].file}></iframe>}
      {current_index !== uploaded_files.length-1 && <button className='scroll-button' id='next-img-btn' onClick={(e) => handle_next_click(e)}><IoIosArrowForward /></button>}
      {clamp && is_clamp && <button className='seefullimg-btn'>See Full Image</button>}
    </div>
  )
}

export default FileViewer
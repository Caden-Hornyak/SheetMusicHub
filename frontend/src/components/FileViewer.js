import React, { useState } from 'react';
import './FileViewer.css'
import { BiLeftArrow, BiRightArrow, BiX } from "react-icons/bi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";


const FileViewer = ({ uploaded_files, wipe_upload=null }) => {
  const [current_index, set_current_index] = useState(0);

  const handle_prev_click = (e) => {
    e.stopPropagation()
    set_current_index(prev_state => prev_state - 1);
  };

  const handle_next_click = (e) => {
    e.stopPropagation()
    set_current_index(prev_state => prev_state + 1);
  };

  return (
    <div className="file-viewer">
      {wipe_upload && <button onClick={() => wipe_upload(uploaded_files[current_index])} ></button>}
      {current_index !== 0 && <button className='scroll-button' id='prev-img-btn' onClick={(e) => handle_prev_click(e)}><IoIosArrowBack /></button>}
      {uploaded_files[current_index].type == 'image' && <img src={uploaded_files[current_index].file}></img>}
      {uploaded_files[current_index].type == 'video' && (
        <video controls width="400" height="300">
          <source src={URL.createObjectURL(uploaded_files[current_index])} type={uploaded_files[current_index].type} />
          Your browser does not support the video tag.
        </video>
      )}
      {uploaded_files[current_index].type == 'pdf' && <iframe src={URL.createObjectURL(uploaded_files[current_index])}></iframe>}
      {current_index !== uploaded_files.length-1 && <button className='scroll-button' id='next-img-btn' onClick={(e) => handle_next_click(e)}><IoIosArrowForward /></button>}
    </div>
  );
};

export default FileViewer;
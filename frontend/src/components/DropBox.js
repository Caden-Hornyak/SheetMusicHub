import React, { useState, useEffect } from 'react';
import './DropBox.css'
import FileViewer from './FileViewer.js'

const DragAndDropBox = ({ uploaded_files, handle_change, wipe_upload}) => {

  const [dragging, set_dragging] = useState(false);
  const [formatted_files, set_formatted_files] = useState([])

  const handle_drag_enter = (e) => {
    e.preventDefault()
    set_dragging(true)
  };

  const handle_drag_leave = () => {
    set_dragging(false)
  };

  const handle_drag_over = (e) => {
    e.preventDefault()
  };

  const handle_drop = (e) => {
    e.preventDefault()
    set_dragging(false)

    handle_change(e)
  };

  useEffect(() => {
    set_formatted_files(uploaded_files.map((file) => {
      return {
        'file': URL.createObjectURL(file),
        'type': file.type.slice(0, file.type.indexOf('/'))
      }
    }))
  }, [uploaded_files])

  return (
    <div className='dropbox-wrapper'>
      {formatted_files.length === 0 ? 
        <div
        className={`dropbox ${dragging ? 'dragging' : ''}`}
        onDragEnter={handle_drag_enter}
        onDragOver={handle_drag_over}
        onDragLeave={handle_drag_leave}
        onDrop={handle_drop}
        >
        <p>
          Drag & Drop or upload here: 
          <input  type="file" id='file_upload' name='file_upload' onChange={handle_change} 
          accept='image/*, .pdf, video/*' multiple
          />
        </p> 
        <p>(image, video, or pdf)</p>
        
        </div> 
      :
        <FileViewer uploaded_files={formatted_files} wipe_upload={wipe_upload} />
      }
    </div>
  );
};

export default DragAndDropBox;
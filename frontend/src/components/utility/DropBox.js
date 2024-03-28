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
    console.log('handle drop!')
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
        onDragEnter={(e) => handle_drag_enter(e)}
        onDragOver={(e) => handle_drag_over(e)}
        onDragLeave={(e) => handle_drag_leave(e)}
        onDrop={(e) => handle_drop(e)}
        >
        <p className='dropbox-dragtxt'>
          Drag & Drop or upload here:
          <input  type="file" id='file_upload' name='file_upload' onChange={(e) => handle_change(e)} 
          accept='image/*, .pdf, video/*' multiple
          />
        </p> 
        <p className='dropbox-filetxt'>(image, video, or pdf)</p>
        
        </div> 
      :
        <FileViewer uploaded_files={formatted_files} wipe_upload={wipe_upload} />
      }
    </div>
  );
};

export default DragAndDropBox;
import React, { useState } from 'react';
import './DropBox.css'
import FileViewer from './FileViewer.js'

const DragAndDropBox = ({ uploaded_files, handle_change, wipe_upload}) => {

  const [dragging, set_dragging] = useState(false);

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

  return (
    <div>
        {uploaded_files.length === 0 ? 
            <div
            className={`drop-box ${dragging ? 'dragging' : ''}`}
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
            
            </div> 
        :
            <div className='file-preview' >
                <FileViewer uploaded_files={uploaded_files} wipe_upload={wipe_upload} />
            </div> 
        }
    </div>
  );
};

export default DragAndDropBox;
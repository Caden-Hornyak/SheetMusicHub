import React, { useState, useRef, useEffect } from 'react';
import axios from '../configs/axiosConfig';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'
import './CreatePostPage.css'
import { BiX } from 'react-icons/bi'
import DropBox from '../components/DropBox.js'

const CreatePostPage = () => {

    let navigate = useNavigate()

    const [form_data, set_form_data] = useState({
        title: '',
        description: '',
    });
    const [form_files, set_form_files] = useState([])

    const [upload_count, set_upload_count] = useState(0)

    const handle_change = (e) => {
        
        // update files
        if (e.target.files || e.dataTransfer) {
            const file_array = extract_file_info(e)

            for (let file_key in file_array) {
                let file = file_array[file_key]

                if (upload_count >= 10) {
                    alert("More than 10 files uploaded. Only uploaded the first ten")
                    break
                }

                set_form_files(prev_state => [...prev_state, file])
                set_upload_count(prev_state => prev_state + 1)

            }
        } else {
            // If it's not a file input, update as usual
            set_form_data({
                ...form_data,
                [e.target.name]: e.target.value,
            })
        }
      }

      const extract_file_info = (e) => {
        if (e.dataTransfer && e.dataTransfer.files) {
            console.log("Drag and drop")
            // For drag-and-drop
            const file_array = Array.from(e.dataTransfer.files).map((file) => {
                return file
            })
            return file_array
          } else {
            console.log("Normal File Upload")
            // For regular file input
            const file_array = Array.from(e.target.files).map((file) => {
                return file
            })
            return file_array
          }
      }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let type_list = []
            let post_form_data = new FormData()
            post_form_data.append('title', form_data.title)
            post_form_data.append('description', form_data.description)

            form_files.forEach(file => {
                post_form_data.append('files', file)
                type_list.push(file.type)
              });
            post_form_data.append('file_types', JSON.stringify(type_list))

            const config = {
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
            }

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/create-post/`,
                post_form_data,
                config 
                );
            
            if (res.data.error) {
                console.log(res.data.error) 
            } else {
                navigate(`/posts/${res.data.id}`)
            }

        } catch (error) {
            // Handle errors (e.g., show an error message)
            console.error('Error uploading file:', error);
        }
    }

    let wipe_upload = (file=null) => {
        if (file === null) {
            set_form_files([])
            set_upload_count(0)
        } else {
            set_form_files(prev_state => prev_state.filter(curr_file => curr_file !== file))
            set_upload_count(prev_state => prev_state - 1)
        }
    }

    return(
        <div>
            <Navbar />
            
            <div id="createpost-body">
                <DropBox uploaded_files={form_files} handle_change={handle_change} wipe_upload={wipe_upload} />
                <form onSubmit={handleSubmit} id='createpost-form'>
                    <input className='createpost-input' type="text" id="title" name="title" placeholder="Title" onChange={handle_change}/>
                    <textarea className='createpost-input' type="text" id='description' name='description' placeholder='Description' onChange={handle_change} />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePostPage
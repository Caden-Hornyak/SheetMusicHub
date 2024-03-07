import React, { useState, useRef } from 'react';
import axios from '../configs/axiosConfig';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom'
import './CreatePostPage.css'
import { BiX } from 'react-icons/bi'

const CreatePostPage = () => {

    let navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        pdf_file: null,
        images: null,
    });

    // when user uploads one file, the other dissapears
    const [is_pdf, setis_pdf] = useState(true)
    const [is_image, setis_image] = useState(true)

    // refs to files for clearing file uploads
    const pdf_ref = useRef(null)
    const image_ref = useRef(null)

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === 'pdf_file' || name === 'image_upload') {

            setFormData({
                ...formData,
                [name]: files[0],
            });

            if (name === 'image_upload') {
                setis_pdf(false)
            } else {
                setis_image(false)
            }
            
        } else {
            // If it's not a file input, update as usual
            setFormData({
                ...formData,
                [name]: value,
            });
        }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let formDataToSend = new FormData();
            formDataToSend.append('title', formData.title); 
            formDataToSend.append('pdf_file', formData.pdf_file);
            formDataToSend.append('description', formData.description);

            const config = {
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
            }

            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/create-post/`,
                formDataToSend,
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
    };

    let wipe_upload = () => {

        pdf_ref.current.value = ''
        image_ref.current.value = ''

        setis_image(true)
        setis_pdf(true)
    }

    return(
        <div>
            <Navbar />
            <div id="createpost-body">
                <form onSubmit={handleSubmit} id='createpost-form'>
                    <input className='createpost-input' type="text" id="title" name="title" placeholder="Title" onChange={handleChange}/>
                    <textarea className='createpost-input' type="text" id='description' name='description' placeholder='Description' onChange={handleChange} />

                    {is_pdf && <input className='createpost-input' type="file" 
                    id="pdf_file" name="pdf_file"  accept="application/pdf" onChange={handleChange} ref={pdf_ref} />}
                    {is_image && <input
                        type="file"
                        id="image_upload"
                        name="image_upload"
                        accept="image/*"
                        onChange={handleChange}
                        ref={image_ref}
                    />}
                    {(!is_image || !is_pdf) && <button onClick={wipe_upload}><BiX /></button>}
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default CreatePostPage
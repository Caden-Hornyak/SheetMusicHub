import React, { useState, useEffect} from 'react';
import axios from '../configs/axiosConfig';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';

const CreatePostPage = () => {


    const [formData, setFormData] = useState({
        // Initialize form fields here
        // For example:
        title: '',
        pdf_file: '',
    });

    const handleChange = (e) => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title); 
            formDataToSend.append('pdf_file', formData.pdf_file);

            console.log(formDataToSend.get('title'), formDataToSend.get('pdf_file'))

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRFToken': Cookies.get('csrftoken')
                },
            }

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/create-post/`,
                formDataToSend,
                config 
                );
            
            let id = response.data.id
            // Handle the response as needed (e.g., show a success message)
            console.log('File uploaded successfully:', response.data);
        } catch (error) {
            // Handle errors (e.g., show an error message)
            console.error('Error uploading file:', error);
        }
    };

    return(
        <div>
            <Navbar />
            <form onSubmit={handleSubmit}>
                <input type="text" id="title" name="title" placeholder="Title" onChange={handleChange}/>
                <input type="file" id="pdf_file" name="pdf_file"  accept="application/pdf" onChange={handleChange}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreatePostPage
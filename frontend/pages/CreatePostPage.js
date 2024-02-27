import React, { useState, useEffect} from 'react'

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
            console.log(JSON.stringify(formData))
            const response = await fetch('posts/createPost', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            // Handle successful submission, e.g., redirect or show a success message
            console.log('Post created successfully');
        } else {
            // Handle error cases
            console.error('Failed to create post');
        }
        } catch (error) {
        console.error('Error:', error);
        }
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" id="title" name="title" placeholder="Title" onChange={handleChange}/>
                <input type="file" id="pdf_file" name="pdf_file"  accept="application/pdf" onChange={handleChange}/>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreatePostPage
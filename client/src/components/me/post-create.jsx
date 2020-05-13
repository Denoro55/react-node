import React, {useRef, useState} from "react";

const PostCreate = (props) => {
    const {apiService, user, addPost} = props;

    const [postText, setPostText] = useState('');
    const postFileInput = useRef(null);

    const changePostText = (e) => {
        setPostText(e.target.value)
    };

    const handleFileUpload = () => {
        postFileInput.current.click();
    };

    const createPost = (e) => {
        e.preventDefault();

        if (postText.length > 0) {
            const data = new FormData();
            data.append('text', postText);
            data.append('id', user.id);
            data.append('image', postFileInput.current.files[0]);

            apiService.createPost(data, user.token).then(res => {
                console.log('post created ', e);
                setPostText('');
                addPost(res.post);
            })
        }
    };

    return (
        <form onSubmit={createPost} className="post-create">
            <input ref={postFileInput} className="hidden" type="file"/>
            <div className="post-create__icon">
                <div className="post-icon">
                    <i className="fa fa-comments-o" aria-hidden="true" />
                </div>
            </div>
            <div className="post-create__wrap">
                <div className="post-create__input">
                                            <textarea onChange={changePostText} placeholder="Write a new post..." className="textarea-theme" value={postText} id="" cols="30" rows="10">
                                            </textarea>
                </div>
                <div className="post-create__actions">
                    <div className="post-create__action">
                        <button onClick={handleFileUpload} className="btn">
                            <i className="fa fa-picture-o"
                               aria-hidden="true" />
                        </button>
                    </div>
                    <div className="post-create__action">
                        <button type="submit" className="btn">Post</button>
                    </div>
                </div>
            </div>
        </form>
    )
};

export default PostCreate;

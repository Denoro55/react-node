import React, {useRef, useState} from "react";
import cn from 'classnames'

const PostCreate = (props) => {
    const {apiService, user, addPost, updatePosts, wallId} = props;

    const [postText, setPostText] = useState('');
    const [postImageSrc, setPostImageSrc] = useState(null);

    const postFileInput = useRef(null);
    const postFileButton = useRef(null);
    const postSubmitButton = useRef(null);
    const postImage = useRef(null);

    const onChangePostText = (e) => {
        setPostText(e.target.value)
    };

    const onFileUpload = (e) => {
        if (postImageSrc){
            setPostImageSrc(null);
            postFileButton.current.blur();
        } else {
            postFileInput.current.click();
        }
    };

    const onPostFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            postFileButton.current.blur();

            reader.onloadend = function () {
                const previewImage = reader.result;
                setPostImageSrc(previewImage);
            };
        } else {
            setPostImageSrc(null);
        }
    };

    const resetForm = () => {
        setPostText('');
        setPostImageSrc(null);
        postSubmitButton.current.blur();
    };

    const createPost = (e) => {
        e.preventDefault();

        const file = postFileInput.current.files[0];

        if (postText.length > 0 || file) {
            const data = new FormData();
            data.append('text', postText);
            data.append('id', user.id);
            data.append('wallId', wallId);
            data.append('image', file);

            apiService.createPost(data).then(res => {
                resetForm();
                updatePosts(res.body.posts);
                // addPost(res.body.post);
            }).catch(e => {

            })
        }
    };

    const btnImageClasses = cn({
        'btn': true,
        'btn-danger': postImageSrc
    });

    return (
        <form onSubmit={createPost} className="post-create">
            <input onChange={onPostFileChange} ref={postFileInput} className="hidden" type="file"/>
            <div className="post-create__icon">
                <div className="post-icon">
                    <i className="fa fa-comments-o" aria-hidden="true" />
                </div>
            </div>
            <div className="post-create__wrap">
                { postImageSrc ? (
                    <div className="post-create__image">
                        <img ref={postImage} src={postImageSrc} alt=""/>
                    </div>
                ) : null }
                <div className="post-create__input">
                    <textarea onChange={onChangePostText} placeholder="Write a new post..." className="textarea-theme" value={postText} id="" cols="30" rows="10">
                    </textarea>
                </div>
                <div className="post-create__actions">
                    <div className="post-create__action">
                        <div ref={postFileButton} onClick={onFileUpload} className={btnImageClasses}>
                            <i className="fa fa-picture-o"
                               aria-hidden="true" />
                        </div>
                    </div>
                    <div className="post-create__action">
                        <button ref={postSubmitButton} type="submit" className="btn">Post</button>
                    </div>
                </div>
            </div>
        </form>
    )
};

export default PostCreate;

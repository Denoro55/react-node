import React, {useContext} from "react";
import VariableProvider from '../context/vars'

const Comment = (props) => {
    const {user, c, apiService} = props;

    const {path: publicPath} = useContext(VariableProvider);

    const likeComment = (commentId, isLiked) => {
        apiService.likeComment( commentId, isLiked).then(res => {
            console.log(res);
        })
    };

    return (
        <div className="comment">
            <div className="comment__avatar" style={{backgroundImage: `url(${publicPath}${c.user.avatarUrl})`}}>

            </div>
            <div className="comment__content">
                <div className="comment__head">
                    <div className="comment__name">
                        <strong>{c.user.name}</strong>
                    </div>
                    <div className="comment__date">
                        {c.time}
                    </div>
                </div>
                <div className="comment__body">
                    <div className="comment__text">
                        {c.text}
                    </div>
                    <div className="comment__likes">
                        <div onClick={() => likeComment(c._id, c.isLiked)} className="comment-like">
                            <i className="fa fa-heart-o" aria-hidden="true"/> 12
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Comment;

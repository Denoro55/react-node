import React from "react";

const ProfileWallList = (props) => {
    const {posts} = props;

    const renderPosts = () => {
        return posts.map(post => {
            return (
                <div className="profile-wall__item">
                    <div className="profile-post">
                        <div className="profile-post__icon">
                            <div className="post-icon post-icon_tomato">
                                <i className="fa fa-pencil" aria-hidden="true"/>
                            </div>
                        </div>
                        <div className="profile-post__head">
                            <div className="profile-post__head-left">
                                <span className="profile-post__name">Denis</span> posted an article
                            </div>
                            <div className="profile-post__head-right">
                                { post.time }
                            </div>
                        </div>
                        <div className="profile-post__body">
                            <div className="profile-post__content">
                                { post.text }
                            </div>
                        </div>
                        <div className="profile-post__info">
                            <div className="post-info">
                                <div className="post-info__comments">
                                    <i className="fa fa-comment-o" aria-hidden="true"/> 0 Comments
                                </div>
                                <div className="post-info__likes">
                                    <i className="fa fa-heart-o" aria-hidden="true"/> 0 Likes
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        })
    };

    return (
        <div className="profile-wall__list">
            { renderPosts() }

            {/*<div className="profile-wall__item">*/}
            {/*    <div className="profile-post">*/}
            {/*        <div className="profile-post__icon">*/}
            {/*            <div className="post-icon post-icon_green">*/}
            {/*                <i className="fa fa-picture-o" aria-hidden="true" />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="profile-post__head">*/}
            {/*            <div className="profile-post__head-left">*/}
            {/*                <span className="profile-post__name">Denis</span> posted a photo*/}
            {/*            </div>*/}
            {/*            <div className="profile-post__head-right">*/}
            {/*                22 min ago*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="profile-post__image">*/}
            {/*            <img src="https://vodabereg.ru/wp-content/uploads/2016/08/serfing.jpg" alt=""/>*/}
            {/*            <div className="post-info">*/}
            {/*                <div className="post-info__comments">*/}
            {/*                    <i className="fa fa-comment-o" aria-hidden="true"/>21 Comments*/}
            {/*                </div>*/}
            {/*                <div className="post-info__likes">*/}
            {/*                    <i className="fa fa-heart-o" aria-hidden="true"/> 12 Likes*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
            {/*<div className="profile-wall__item">*/}
            {/*    <div className="profile-post">*/}
            {/*        <div className="profile-post__icon">*/}
            {/*            <div className="post-icon post-icon_tomato">*/}
            {/*                <i className="fa fa-pencil" aria-hidden="true"/>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="profile-post__head">*/}
            {/*            <div className="profile-post__head-left">*/}
            {/*                <span className="profile-post__name">Denis</span> posted an article*/}
            {/*            </div>*/}
            {/*            <div className="profile-post__head-right">*/}
            {/*                55 min ago*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="profile-post__body">*/}
            {/*            <div className="profile-post__content">*/}
            {/*                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam amet at consequatur, corporis delectus deserunt, distinctio error expedita facilis magnam, odio odit placeat rerum soluta vel veritatis voluptas. Blanditiis, molestias!*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*        <div className="profile-post__info">*/}
            {/*            <div className="post-info">*/}
            {/*                <div className="post-info__comments">*/}
            {/*                    <i className="fa fa-comment-o" aria-hidden="true"/> 21 Comments*/}
            {/*                </div>*/}
            {/*                <div className="post-info__likes">*/}
            {/*                    <i className="fa fa-heart-o" aria-hidden="true"/> 12 Likes*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
};

export default ProfileWallList;

import React from "react";
import PropTypes from "prop-types";

const Comment = ({ commentatorName, timeAgo, value }) => {
    return (
        <>
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <p className="mb-1">
                        {commentatorName}
                        <span className="small">{timeAgo}</span>
                    </p>
                    <button className="btn btn-sm text-primary d-flex align-items-center">
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <p className="small mb-0">{value}</p>
            </div>
        </>
    );
};

Comment.propTypes = {
    commentatorName: PropTypes.string,
    timeAgo: PropTypes.string,
    value: PropTypes.string
};

export default Comment;

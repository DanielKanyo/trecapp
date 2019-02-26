import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ReactHtmlParser from 'react-html-parser';
import Emojify from 'react-emojione';
import { Link } from 'react-router-dom';
import FaceIcon from '@material-ui/icons/Face';

const styles = theme => ({
  bigAvatar: {
    width: 44,
    height: 44,
    marginRight: 14
  },
});

const emojiOptions = {
  style: {
    height: 20,
    margin: 0,
  },
}

class CommentItem extends Component {
  /**
   * Constructor
   * 
   * @param {Object} props 
   */
  constructor(props) {
    super(props);
    this.state = {
      profilePicUrl: props.dataProp.profilePicUrl,
      username: props.dataProp.username,
      timestamp: props.dataProp.timestamp,
      comment: props.dataProp.comment,
      isMineComment: props.dataProp.isMineComment,
      key: props.dataProp.key,
      userId: props.dataProp.userId
    };
  }

  formatDate = (time) => {
    let year = new Date(time).getFullYear();
    let month = this.props.languageObjectProp.data.months[new Date(time).getMonth()];
    let day = new Date(time).getDate();

    return `${month} ${day}, ${year}`;
  }

  /**
   * If the string contains an url, then make a link
   */
  urlify = (text) => {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let newText = text.replace(/^\s+|\s+$/g, '');

    return newText.replace(urlRegex, function (url) {
      let u = new URL(url);

      return '<a target="_blank" href="' + url + '">' + u.hostname + '</a>';
    });
  }

  handleRemoveComment = (id) => {
    this.props.removeCommentProp(id);
  }

  render() {
    const { classes } = this.props;
    const { username, profilePicUrl, timestamp, comment, isMineComment, key, userId } = this.state;

    const datetime = this.formatDate(timestamp);
    const urlToUser = `/user/${userId}`;

    return (
      <div className="CommentItem">
        <div className="comment-item-header">
          <div>
            <div className="comment-avatar">
              {
                profilePicUrl ?
                  <Avatar alt={username} src={profilePicUrl} className={classes.bigAvatar} component={Link} to={urlToUser} /> :
                  <Avatar alt={username} className={classes.bigAvatar} component={Link} to={urlToUser}><FaceIcon /></Avatar>
              }
            </div>
            <div className="comment-name-and-datetime">
              <div className="comment-name">{username}</div>
              <div className="comment-datetime">{datetime}</div>
            </div>
          </div>
          {
            isMineComment &&
            <div className="delete-comment-container">
              <IconButton onClick={() => { this.handleRemoveComment(key) }} aria-label="Delete">
                <CloseIcon fontSize="small" />
              </IconButton>
            </div>
          }
        </div>
        <div className="comment-content-text">
          <Emojify style={emojiOptions.style}>
            {ReactHtmlParser(this.urlify(comment))}
          </Emojify>
        </div>
      </div>
    )
  }
}

CommentItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CommentItem);
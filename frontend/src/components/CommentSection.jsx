import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HiTrash, HiOutlineChatBubbleLeft } from 'react-icons/hi2';
import { createComment, deleteComment } from '../api';
import toast from 'react-hot-toast';

function CommentSection({ postId, comments, onUpdate }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }

    setSubmitting(true);
    try {
      await createComment({
        post_id: postId,
        author: author.trim() || 'Anonymous',
        content: content.trim(),
      });
      setAuthor('');
      setContent('');
      toast.success('Comment posted.');
      onUpdate();
    } catch (err) {
      toast.error('Could not post comment. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await deleteComment(commentId);
      toast.success('Comment deleted.');
      onUpdate();
    } catch (err) {
      toast.error('Could not delete comment.');
    }
  };

  return (
    <div className="comments-section">
      <h2 className="comments-header">
        <HiOutlineChatBubbleLeft size={20} />
        Comments ({comments.length})
      </h2>

      <form className="comment-form" onSubmit={handleSubmit}>
        <div className="comment-form-row">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div className="comment-form-row">
          <textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post comment'}
        </button>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-item-header">
              <span className="comment-author">@{comment.author}</span>
              <span className="comment-date">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="comment-content">{comment.content}</p>
            <div className="comment-actions">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleDelete(comment.id)}
                title="Delete comment"
              >
                <HiTrash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <div className="comments-empty">No comments yet. Start the conversation.</div>
      )}
    </div>
  );
}

export default CommentSection;

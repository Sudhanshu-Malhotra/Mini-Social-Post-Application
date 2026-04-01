import React, { useState, useContext } from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardActions, 
  Avatar, 
  Typography, 
  IconButton,
  Box,
  TextField,
  Button,
  Collapse,
  Divider,
  Zoom,
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { format } from 'timeago.js';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import LikesModal from './LikesModal';

export default function PostCard({ post, setPosts }) {
  const { user } = useContext(AuthContext);
  const [expanded, setExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showHeart, setShowHeart] = useState(false);
  const [likesOpen, setLikesOpen] = useState(false);

  const myId = user?.id || user?._id;
  const authorId = post?.author?.userId?._id || post?.author?.userId; // Handling both raw and populated
  
  const isAuthor = (myId && authorId && myId.toString() === authorId.toString()) || 
                   (user?.username && post?.author?.username && user.username.toLowerCase() === post.author.username.toLowerCase());

  const isLiked = Array.isArray(post?.likes) && post.likes.some(like => {
    const likeId = like.userId?._id || like.userId;
    return likeId?.toString() === myId?.toString();
  });
  
  const likeCount = Array.isArray(post?.likes) ? post.likes.length : 0;
  const commentCount = Array.isArray(post?.comments) ? post.comments.length : 0;

  const handleLike = async () => {
    // 1. Optimistic UI Update
    const previousLikes = [...post.likes];
    const currentUserId = user?._id || user?.id;
    let newLikes;
    if (isLiked) {
      newLikes = post.likes.filter(like => like.userId?.toString() !== currentUserId?.toString());
    } else {
      newLikes = [...post.likes, { userId: currentUserId, username: user.username }];
    }

    // Update parent state immediately
    setPosts(prevPosts => 
      prevPosts.map(p => p._id === post._id ? { ...p, likes: newLikes } : p)
    );

    try {
      const res = await api.post(`/posts/${post._id}/like`);
      // 2. Sync with server (ensure data is correct)
      setPosts(prevPosts => 
        prevPosts.map(p => p._id === post._id ? { ...p, likes: res.data.data } : p)
      );
    } catch (err) {
      console.error("Like failed, rolling back", err);
      // 3. Rollback on error
      setPosts(prevPosts => 
        prevPosts.map(p => p._id === post._id ? { ...p, likes: previousLikes } : p)
      );
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (commentText.length > 300) return;

    // 1. Optimistic UI Update
    const previousComments = [...post.comments];
    const newComment = {
      userId: user?._id || user?.id,
      username: user.username,
      text: commentText,
      createdAt: new Date().toISOString(),
      isOptimistic: true // Local flag
    };

    const newComments = [newComment, ...post.comments];
    
    // Update parent state immediately
    setPosts(prevPosts => 
      prevPosts.map(p => p._id === post._id ? { ...p, comments: newComments } : p)
    );
    
    const savedCommentText = commentText;
    setCommentText('');

    try {
      const res = await api.post(`/posts/${post._id}/comment`, { text: savedCommentText });
      // 2. Sync with server
      setPosts(prevPosts => 
        prevPosts.map(p => p._id === post._id ? { ...p, comments: res.data.data } : p)
      );
    } catch (err) {
      console.error("Comment failed, rolling back", err);
      // 3. Rollback
      setPosts(prevPosts => 
        prevPosts.map(p => p._id === post._id ? { ...p, comments: previousComments } : p)
      );
      setCommentText(savedCommentText); // Put text back in box
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    // 1. Optimistic UI Update
    setPosts(prevPosts => prevPosts.filter(p => p._id !== post._id));

    try {
      await api.delete(`/posts/${post._id}`);
    } catch (err) {
      console.error("Delete failed, rolling back", err);
      alert("Failed to delete post. Please try again.");
      // 2. Rollback
      setPosts(prevPosts => [...prevPosts, post].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2, overflow: 'hidden' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#eee', color: 'primary.main', fontWeight: 700 }}>
            {post?.author?.username ? post.author.username.charAt(0).toUpperCase() : '?'}
          </Avatar>
        }
        title={<Typography fontWeight="700" variant="subtitle1">{post?.author?.username || 'Unknown User'}</Typography>}
        subheader={<Typography variant="caption" color="text.secondary">{post?.createdAt ? format(post.createdAt) : 'just now'}</Typography>}
        action={
          isAuthor && (
            <IconButton onClick={handleDelete} color="error" size="small">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          )
        }
        sx={{ pb: 1 }}
      />
      
      <CardContent sx={{ pt: 1, pb: 1 }}>
        {post.text && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: post.image ? 2 : 0, color: '#1c1e21' }}>
            {post.text}
          </Typography>
        )}
        
        {post.image && (
          <Box 
            sx={{
              position: 'relative',
              width: 'calc(100% + 32px)',
              ml: -2,
              mr: -2,
              cursor: 'pointer',
              userSelect: 'none'
            }}
            onDoubleClick={handleDoubleTap}
          >
            <Box 
              component="img"
              src={`${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/api$/, '')}${post.image}`}
              alt="Post image"
              sx={{
                width: '100%',
                maxHeight: '500px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {/* Heart Animation Overlay */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 10
            }}>
              <Zoom in={showHeart}>
                <FavoriteIcon sx={{ fontSize: 100, color: 'rgba(255,255,255,0.9)', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.3))' }} />
              </Zoom>
            </Box>
          </Box>
        )}
      </CardContent>

      <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f2f5' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.8, 
            cursor: likeCount > 0 ? 'pointer' : 'default',
            '&:hover': { textDecoration: likeCount > 0 ? 'underline' : 'none' }
          }}
          onClick={() => likeCount > 0 && setLikesOpen(true)}
        >
          <FavoriteIcon color={isLiked ? "secondary" : "inherit"} sx={{ fontSize: 20, color: isLiked ? '#ed4956' : '#65676b' }} />
          <Typography variant="body2" sx={{ fontSize: '0.85rem', fontWeight: 600, color: 'text.primary' }}>
            {likeCount > 0 ? (
              <>
                {post.likes[0].username}
                {likeCount > 1 && ` and ${likeCount - 1} ${likeCount - 1 === 1 ? 'other' : 'others'}`}
              </>
            ) : (
              '0 likes'
            )}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
        </Typography>
      </Box>

      <CardActions disableSpacing sx={{ px: 1, py: 0.5 }}>
        <Button 
          fullWidth 
          startIcon={isLiked ? <FavoriteIcon sx={{ color: '#ed4956' }} /> : <FavoriteBorderIcon />}
          onClick={handleLike}
          sx={{ color: isLiked ? '#ed4956' : 'text.secondary', fontWeight: 600 }}
        >
          Like
        </Button>
        <Button 
          fullWidth 
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={() => setExpanded(!expanded)}
          sx={{ color: 'text.secondary', fontWeight: 600 }}
        >
          Comment
        </Button>
      </CardActions>

      <LikesModal 
        open={likesOpen} 
        handleClose={() => setLikesOpen(false)} 
        likes={post.likes} 
      />

      {/* Modern Comment Preview Section */}
      <Box sx={{ px: 2, pb: expanded ? 0 : 2 }}>
        {commentCount > 0 && (
          <>
            {!expanded && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                {post.comments.slice(0, 2).map((comment, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'baseline' }}>
                    <Typography variant="body2" fontWeight="700" sx={{ fontSize: '0.85rem' }}>
                      {comment.username}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {comment.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
            
            {commentCount > 2 && !expanded && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ cursor: 'pointer', mb: 1, '&:hover': { textDecoration: 'underline' } }}
                onClick={() => setExpanded(true)}
              >
                View all {commentCount} comments
              </Typography>
            )}
          </>
        )}
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />
        <Box sx={{ p: 2 }}>
          {/* Comment input list */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3, maxHeight: '250px', overflowY: 'auto' }}>
            {Array.isArray(post?.comments) && post.comments.map((comment, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1.5 }}>
                <Avatar sx={{ width: 28, height: 28, fontSize: '0.875rem' }}>
                  {comment?.username ? comment.username.charAt(0).toUpperCase() : '?'}
                </Avatar>
                <Box sx={{ 
                  bgcolor: '#f0f2f5', 
                  borderRadius: '18px', 
                  px: 2, 
                  py: 1, 
                  flex: 1,
                }}>
                  <Typography variant="subtitle2" fontWeight="600" sx={{ lineHeight: 1.2 }}>
                    {comment?.username || 'Anonymous'}
                  </Typography>
                  <Typography variant="body2" sx={{ m: 0 }}>
                    {comment?.text || ''}
                  </Typography>
                </Box>
              </Box>
            ))}
            {(!post?.comments || post.comments.length === 0) && (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={1}>
                No comments yet. Be the first to comment!
              </Typography>
            )}
          </Box>

          <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
              {user?.username ? user.username.charAt(0).toUpperCase() : '?'}
            </Avatar>
            <TextField
              size="small"
              fullWidth
              placeholder="Write a comment..."
              variant="outlined"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value.slice(0, 300))}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 5,
                  bgcolor: 'rgba(255,255,255,0.05)',
                }
              }}
            />
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!commentText.trim()}
              sx={{ borderRadius: 5, minWidth: '80px' }}
            >
              Post
            </Button>
          </Box>
        </Box>
      </Collapse>
    </Card>
  );
}

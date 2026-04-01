import React, { useState, useContext } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  IconButton, 
  Box,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ImageIcon from '@mui/icons-material/Image';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function CreatePostModal({ open, handleClose, onPostCreated }) {
  const { user } = useContext(AuthContext);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5000000) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!text.trim() && !image) {
      setError('Post must contain text or an image');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    if (text.trim()) formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      const res = await api.post('/posts', formData);
      if (res.data.success) {
        onPostCreated(res.data.data);
      } else {
        throw new Error(res.data.msg || 'Creation failed');
      }
      setText('');
      removeImage();
      handleClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = (!text.trim() && !image) || loading;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.2)' } }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, py: 2, borderBottom: '1px solid #dadde1' }}>
        Create Post
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 12, color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="700" sx={{ lineHeight: 1.2 }}>{user?.username}</Typography>
            <Box sx={{ bgcolor: '#e4e6eb', px: 1, borderRadius: 1.5, width: 'fit-content' }}>
              <Typography variant="caption" fontWeight="700">Public</Typography>
            </Box>
          </Box>
        </Box>

        <TextField
          multiline
          rows={image ? 2 : 5}
          fullWidth
          variant="standard"
          placeholder={user?.username ? `What's on your mind, ${user.username}?` : "What's on your mind?"}
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          sx={{ mb: 1 }}
          InputProps={{ disableUnderline: true, style: { fontSize: '1.25rem' } }}
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Typography variant="caption" color={text.length >= 500 ? 'error' : 'text.secondary'}>
            {text.length}/500
          </Typography>
        </Box>

        {preview && (
          <Box sx={{ position: 'relative', mt: 1, mb: 1, borderRadius: 2, overflow: 'hidden', border: '1px solid #dadde1' }}>
            <img 
              src={preview} 
              alt="Preview" 
              style={{ width: '100%', maxHeight: '350px', objectFit: 'contain', display: 'block', backgroundColor: '#f7f8f9' }} 
            />
            <IconButton 
              onClick={removeImage}
              sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.9)', '&:hover': { bgcolor: 'white' } }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #dadde1', p: 1.5, borderRadius: 2, mt: 2 }}>
          <Typography variant="subtitle2" fontWeight="700">Add to your post</Typography>
          <IconButton component="label" color="primary" sx={{ bgcolor: '#e7f3ff', '&:hover': { bgcolor: '#dbe7f2' } }}>
            <ImageIcon />
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </IconButton>
        </Box>
      </DialogContent>
      
      <Box sx={{ px: 3, pb: 3 }}>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={handleSubmit} 
          disabled={isSubmitDisabled}
          sx={{ py: 1.2, fontWeight: 700, fontSize: '1rem', borderRadius: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
        </Button>
      </Box>
    </Dialog>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Box, 
  Fab,
  CircularProgress,
  Typography,
  Alert,
  Button,
  Skeleton,
  Card,
  Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPosts(1, true);
  }, []);

  const fetchPosts = async (pageNumber, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const res = await api.get(`/posts?page=${pageNumber}&limit=5`); // Smaller limit for smoother scrolling
      const newPosts = res.data.posts || [];
      
      if (isInitial) {
        setPosts(newPosts);
      } else {
        setPosts(prev => Array.isArray(prev) ? [...prev, ...newPosts] : newPosts);
      }

      setHasMore(pageNumber < res.data.totalPages);
      setPage(pageNumber);
      setError('');
    } catch (err) {
      setError('Failed to load posts. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4, pb: 10 }}>
      {/* Create Post Shortcut */}
      <Card sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box 
            onClick={() => setModalOpen(true)}
            sx={{ 
              bgcolor: '#f0f2f5', 
              px: 2, 
              py: 1, 
              borderRadius: 10, 
              flex: 1, 
              cursor: 'pointer',
              '&:hover': { bgcolor: '#e4e6eb' },
              transition: 'background-color 0.2s'
            }}
          >
            <Typography color="text.secondary">
              What's on your mind, {user?.username}?
            </Typography>
          </Box>
        </Box>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {loading ? (
        <Box>
          {[1, 2, 3].map(i => (
            <Card key={i} sx={{ mb: 3, borderRadius: 2, p: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                  <Box sx={{ width: '40%' }}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" width="60%" sx={{ fontSize: '0.8rem' }} />
                  </Box>
               </Box>
               <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 1, mx: -2, width: 'calc(100% + 32px)' }} />
               <Skeleton variant="text" sx={{ mt: 2, fontSize: '1rem' }} />
               <Skeleton variant="text" width="80%" sx={{ fontSize: '1rem' }} />
            </Card>
          ))}
        </Box>
      ) : (
        <Box>
          {posts.length > 0 ? (
            <>
              {posts.map(post => (
                <PostCard 
                  key={post._id} 
                  post={post} 
                  setPosts={setPosts} 
                />
              ))}
              
              {hasMore && (
                <Box textAlign="center" mt={2} mb={4}>
                  <Button 
                    variant="contained" 
                    onClick={handleLoadMore} 
                    disabled={loadingMore}
                    sx={{ 
                      borderRadius: 2, 
                      px: 4, 
                      py: 1,
                      bgcolor: '#ffffff',
                      color: 'primary.main',
                      border: '1px solid #dadde1',
                      '&:hover': { bgcolor: '#f2f2f2' },
                      fontWeight: 700
                    }}
                  >
                    {loadingMore ? <CircularProgress size={24} /> : 'Load More'}
                  </Button>
                </Box>
              )}
              
              {!hasMore && posts.length > 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" pb={4}>
                  You've reached the end of the world! 🌍
                </Typography>
              )}
            </>
          ) : (
            <Box textAlign="center" my={5} color="text.secondary">
              <Typography variant="h6">No posts yet</Typography>
              <Typography>Be the first to share something!</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* Floating Action Button for mobile/desktop to create post */}
      <Fab 
        color="primary" 
        aria-label="add" 
        onClick={() => setModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 40 },
          right: { xs: 20, md: 40 },
          boxShadow: 3
        }}
      >
        <AddIcon />
      </Fab>

      <CreatePostModal 
        open={modalOpen} 
        handleClose={() => setModalOpen(false)} 
        onPostCreated={handlePostCreated}
      />
    </Container>
  );
}

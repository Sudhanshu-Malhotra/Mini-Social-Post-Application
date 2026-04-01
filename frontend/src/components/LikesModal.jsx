import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function LikesModal({ open, handleClose, likes }) {
  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 800, borderBottom: '1px solid #dadde1', py: 1.5 }}>
        Likes
        <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List sx={{ pt: 1 }}>
          {likes && likes.length > 0 ? (
            likes.map((like, index) => (
              <ListItem key={index} sx={{ py: 1, px: 2 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                    {like.username ? like.username.charAt(0).toUpperCase() : '?'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={<Typography fontWeight="700" variant="body1">{like.username}</Typography>} 
                />
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
              No likes yet
            </Typography>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}

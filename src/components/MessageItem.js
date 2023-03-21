import { ListItem, ListItemText, Typography, Divider } from '@mui/material';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';
import { Fragment } from 'react';

const MessageItem = ({item}) => {
    return (
      <>
        <ListItem alignItems="flex-start">
          {/* <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar> */}
          <ListItemText
            // primary=""
            secondary={
              <Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {item.user}
                </Typography>
                <p style={{ color: 'black' }}>{item.message}</p> 
              </Fragment>
            }
          />
        </ListItem>
        <Divider />
      </>
    )
  }
  
export default MessageItem;
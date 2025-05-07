import { Avatar, Box, IconButton } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import React, { useContext, useState } from 'react';
import MyContext from '../context/context';

const ProfilePage = () => {
  const [bannerImage, setBannerImage] = useState<string>('/images/profile_banner.jpg');
  const { user } = useContext(MyContext)!;

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerImage(imageUrl);
    }
  }

  const handleProfileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {

  }

  return (
    <Box sx={{ position: 'relative', maxWidth: "1100px", margin: '0 auto' }}>
      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', sm: '300px', md: '340px' },
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'black',
          borderRadius: '12px',
        }}
      >
        <img
          src={bannerImage}
          alt="Profile Banner"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />

        <IconButton
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
          component="label"
        >
          <input hidden type='file' accept='image/*' onChange={handleBannerUpload} />
          <PhotoCamera />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: { xs: "20%", sm: "5%", md: "5%" },
          bottom: { xs: -64, sm: -96, md: -128 },
          transform: { xs: 'translateX(-50%)', sm: 'none' },
          zIndex: 1,
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <Avatar
            src={user?.profileImageUrl}
            sx={{
              width: { xs: 148, sm: 188, md: 228 },
              height: { xs: 148, sm: 188, md: 228 },
              border: '4px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          />
          <IconButton
            component="label"
            sx={{
              position: 'absolute',
              bottom: {xs: 3, sm: 10, md: 16},
              right: { xs: 3, sm: 10, md: 16 },
              backgroundColor: 'white',
              padding: '8px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <input type='file' accept='image/*' style={{ zIndex: 1000 }} hidden onChange={handleProfileUpload}/>
            <PhotoCamera sx={{ fontSize: '1.2rem' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfilePage
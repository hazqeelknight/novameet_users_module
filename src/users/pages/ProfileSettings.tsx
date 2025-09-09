import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { PageHeader, LoadingSpinner } from '@/components/core';
import { ProfileForm } from '../components';
import { useProfile, useUpdateProfile } from '../api';
import { Profile } from '../types';

const ProfileSettings: React.FC = () => {
  const { data: profile, isLoading, error } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleProfileUpdate = (updates: Partial<Profile> | FormData) => {
    updateProfileMutation.mutate(updates);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  if (error) {
    return (
      <Box>
        <PageHeader title="Profile Settings" />
        <Alert severity="error">
          Failed to load profile data. Please try again.
        </Alert>
      </Box>
    );
  }

  if (!profile) {
    return (
      <Box>
        <PageHeader title="Profile Settings" />
        <Alert severity="warning">
          No profile data found.
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your personal information and preferences"
        breadcrumbs={[
          { label: 'Account', href: '/users' },
          { label: 'Profile Settings' },
        ]}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Your public profile URL: <strong>novameet.com/{profile.organizer_slug}</strong>
          </Typography>
        </Box>

        <ProfileForm
          profile={profile}
          onSubmit={handleProfileUpdate}
          isLoading={updateProfileMutation.isPending}
        />
      </motion.div>
    </>
  );
};

export default ProfileSettings;
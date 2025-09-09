import React from 'react';
import {
  Box,
  TextField,
  Grid,
  Avatar,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Divider,
} from '@mui/material';
import { PhotoCamera, Save } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Button, Card } from '@/components/core';
import { Profile } from '../types';
import { validatePhoneNumber, validateTimezone, getAvailableTimezones } from '../utils';

interface ProfileFormProps {
  profile: Profile;
  onSubmit: (data: Partial<Profile> | FormData) => void;
  isLoading?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSubmit,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  
  const timezones = getAvailableTimezones();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<Partial<Profile>>({
    defaultValues: profile,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Clean up preview URL when component unmounts
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFormSubmit = (data: Partial<Profile>) => {
    if (selectedFile) {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Append all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value.toString());
          } else if (typeof value === 'number') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value as string);
          }
        }
      });
      
      // Append the file
      formData.append('profile_picture', selectedFile);
      
      onSubmit(formData);
    } else {
      // Remove profile_picture from data to avoid sending the URL string
      const { profile_picture, ...updateData } = data;
      onSubmit(updateData);
    }
  };

  // Get current profile picture URL (either preview or existing)
  const currentProfilePicture = previewUrl || profile.profile_picture;

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <Grid container spacing={3}>
        {/* Profile Picture Section */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Profile Picture
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  src={currentProfilePicture || undefined}
                  sx={{ width: 80, height: 80 }}
                >
                  {profile.display_name?.charAt(0) || profile.user?.first_name?.charAt(0)}
                </Avatar>
                <Box>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <PhotoCamera />
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {selectedFile ? 'New image selected' : 'Upload a new profile picture'}
                  </Typography>
                  {selectedFile && (
                    <Typography variant="caption" color="primary.main" display="block">
                      {selectedFile.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Basic Information */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="display_name"
                    control={control}
                    rules={{ required: 'Display name is required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Display Name"
                        error={!!errors.display_name}
                        helperText={errors.display_name?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="job_title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Job Title"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="bio"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Bio"
                        multiline
                        rows={3}
                        placeholder="Tell people a bit about yourself..."
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      validate: (value) => 
                        !value || validatePhoneNumber(value) || 'Invalid phone number format'
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone Number"
                        placeholder="+1 (555) 123-4567"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Website"
                        placeholder="https://example.com"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="company"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Company"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Localization Settings */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Localization
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="timezone_name"
                    control={control}
                    rules={{
                      validate: (value) => 
                        !value || validateTimezone(value) || 'Invalid timezone'
                    }}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Timezone</InputLabel>
                        <Select {...field} label="Timezone">
                          {timezones.map((tz) => (
                            <MenuItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="language"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Language</InputLabel>
                        <Select {...field} label="Language">
                          <MenuItem value="en">English</MenuItem>
                          <MenuItem value="es">Spanish</MenuItem>
                          <MenuItem value="fr">French</MenuItem>
                          <MenuItem value="de">German</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="date_format"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Date Format</InputLabel>
                        <Select {...field} label="Date Format">
                          <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                          <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                          <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="time_format"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Time Format</InputLabel>
                        <Select {...field} label="Time Format">
                          <MenuItem value="12h">12 Hour (AM/PM)</MenuItem>
                          <MenuItem value="24h">24 Hour</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Branding */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Branding
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="brand_color"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Brand Color"
                        type="color"
                        InputProps={{
                          sx: { height: 56 }
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Privacy Settings */}
        <Grid item xs={12}>
          <Card>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Privacy Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Controller
                  name="public_profile"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Make profile public"
                    />
                  )}
                />
                <Controller
                  name="show_email"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Show email on public profile"
                    />
                  )}
                />
                <Controller
                  name="show_phone"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Show phone on public profile"
                    />
                  )}
                />
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              loading={isLoading}
              loadingText="Saving..."
              startIcon={<Save />}
            >
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
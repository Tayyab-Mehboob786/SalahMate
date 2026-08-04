import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { usersApi } from '@/api';

export function useAvatarUpload(onSuccess?: (newAvatarUrl: string) => void) {
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      setLoading(true);
      const response = await usersApi.uploadAvatar(uri);
      if (response.success && response.data.avatar) {
        if (onSuccess) onSuccess(response.data.avatar);
        Alert.alert('Success', 'Avatar updated successfully');
      }
    } catch (error: any) {
      console.error('Upload Error:', error);
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return { pickImage, loading };
}

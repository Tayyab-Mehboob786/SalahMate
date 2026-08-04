import React from 'react';
import { PrimaryButton } from '@/components/common/PrimaryButton';

interface SaveButtonProps {
  onPress: () => void;
  loading?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ onPress, loading }) => {
  return (
    <PrimaryButton
      label="Save Changes"
      onPress={onPress}
      loading={loading}
      fullWidth
      icon="content-save"
    />
  );
};

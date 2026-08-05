import React from 'react';
import { UgcRegistrationForm } from '../components/ui/UgcRegistrationForm';

export const Register: React.FC = () => {
  return (
    <div className="py-6 container mx-auto px-4 md:px-6 space-y-12 w-full">
      <UgcRegistrationForm />
    </div>
  );
};

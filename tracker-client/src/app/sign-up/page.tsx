import React from 'react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <SignUp/>
    </div>
  );
};

export default SignUpPage;

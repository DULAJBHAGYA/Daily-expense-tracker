"use client"
import React from 'react';
import { SignUp } from '@clerk/nextjs';

const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <SignUp 
      signInUrl='/sign-in'
        afterSignUpUrl="/sign-in"
/>
    </div>
  );
}

export default SignUpPage;

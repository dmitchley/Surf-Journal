import { useRouter } from 'next/router';
import { useEffect } from 'react';
import React from 'react'

const index = () => {
  const router = useRouter();
  let token
  useEffect(() => {
    token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  if (!token) {
    return (
      <div>

      </div>
    );
  }


  return (
    <div>
      dashboard
    </div>
  )
}

export default index

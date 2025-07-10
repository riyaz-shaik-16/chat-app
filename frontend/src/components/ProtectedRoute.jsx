import useAuth from '@/hooks/useAuth';
import React from 'react'

const ProtectedRoute = () => {

    const {loading,user} = useAuth();

    if(loading) return <h1>Loading...</h1>

    if(user) return <></>
  return (
    <div>
      
    </div>
  )
}

export default ProtectedRoute

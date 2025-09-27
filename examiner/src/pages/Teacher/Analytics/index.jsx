import React from 'react'
import { useAuth } from '../../Context/AuthContext'

const index = () => {
    const { user } = useAuth();
    console.log(user);
    return (
        <div>index</div>
    )
}

export default index
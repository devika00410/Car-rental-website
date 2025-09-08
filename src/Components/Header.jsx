import React from 'react'
import { useAuth } from '../App';
function Header() {
  const { user, logout } = useAuth();
  return (
    <div>
        <header className='bg-purple-900 p-5'>
            <h3 className=' text-white text-xl'>NexaGo</h3>
            {user && (
        <div>
        </div>
      )}

        </header>
    </div>
  )
}

export default Header
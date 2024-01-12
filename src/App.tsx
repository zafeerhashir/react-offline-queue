/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsersStart } from './slice/user'
import './App.css'
import { getOfflineQueue } from 'react-offline-queue'
import { UnknownAction } from '@reduxjs/toolkit'


interface QueueAction extends UnknownAction {
  timeStamp: string;
}

const UserCard = ({ user }: any) => {
  const {
    name,
    gender,
    location,
    email,
    dob,
    phone,
    cell,
    picture,
    nat,
  } = user;

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px',
        margin: '20px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <img
        src={picture.large}
        alt={`${name.first} ${name.last}`}
        style={{
          borderRadius: '50%',
          marginRight: '20px',
          width: '100px',
          height: '100px',
        }}
      />
      <div>
        <h2>{`${name.title} ${name.first} ${name.last}`}</h2>
        <p>{`Gender: ${gender}`}</p>
        <p>{`Location: ${location.city}, ${location.state}, ${location.country}`}</p>
        <p>{`Email: ${email}`}</p>
        <p>{`Date of Birth: ${dob.date.slice(0, 10)}`}</p>
        <p>{`Phone: ${phone}`}</p>
        <p>{`Cell: ${cell}`}</p>
        <p>{`Nationality: ${nat}`}</p>
      </div>
    </div>
  );
};

const UserList = ({ users }: any) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {users.map((user: any, index: number) => (
        <UserCard key={index} user={user} />
      ))}
    </div>
  );
};

const Queue: React.FC<{ queue: QueueAction[] }> = ({ queue }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {queue.map((action:  QueueAction, index: number) => (
        <div
          key={index}
          style={{
            padding: '10px',
            margin: '5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ marginBottom: '5px' }}>{action.type}</div>
          <div>{action.timeStamp}</div>
        </div>
      ))}
    </div>
  );
}


function App() {
  const dispatch = useDispatch();
  const users = useSelector((state: any) => state.user.users)
  const offlineQueue = useSelector(getOfflineQueue)


  useEffect(() => {
    dispatch(fetchUsersStart())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchAllUsers = () => {
    dispatch(fetchUsersStart())

  };

  return (
    <>
        <button
        onClick={handleFetchAllUsers}
        style={{
          padding: '10px 20px',
          marginTop: '20px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Fetch All Users
      </button>
    <Queue queue={offlineQueue}/>
    <UserList users={users} />

    </>
  )
}

export default App

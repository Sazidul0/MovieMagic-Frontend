import React from 'react';
import { users } from '../../data/users';

const UserList = () => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold my-4">All Users</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <th>{user.id}</th>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
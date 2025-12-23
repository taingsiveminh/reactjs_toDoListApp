import { useState } from 'react'
import './App.css'

const initialUsers = [
  { id: 1, firstName: 'TSM', lastName: 'Dev', email: 'tsmsolitions@gmail.com' },
  { id: 2, firstName: 'taing', lastName: 'siveminh', email: 'taignsiveminh@gmail.com' },
  { id: 3, firstName: 'Cr', lastName: '7', email: 'ronaldo@gmail.com' },
  { id: 4, firstName: 'neymar', lastName: 'jr', email: 'neymarjurnior@gmail.com' },
]

function App() {
  const [users, setUsers] = useState(initialUsers)

  const handleView = (user) => {
    alert(`Name: ${user.firstName} ${user.lastName}\nEmail: ${user.email}`)
  }

  const handleEdit = (user) => {
    const firstName = prompt('First name', user.firstName)
    if (firstName === null) return
    const lastName = prompt('Last name', user.lastName)
    if (lastName === null) return
    const email = prompt('Email', user.email)
    if (email === null) return

    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id ? { ...item, firstName, lastName, email } : item,
      ),
    )
  }

  const handleDelete = (id) => {
    const confirmed = confirm('Delete this user?')
    if (!confirmed) return
    setUsers((prev) => prev.filter((user) => user.id !== id))
  }

  const handleAdd = () => {
    const firstName = prompt('First name')
    if (!firstName) return
    const lastName = prompt('Last name') || ''
    const email = prompt('Email') || ''

    setUsers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), firstName, lastName, email },
    ])
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1>Full stack Application</h1>
        <button className="primary" onClick={handleAdd}>
          Add User
        </button>
      </header>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td className="actions">
                  <button className="view" onClick={() => handleView(user)}>
                    View
                  </button>
                  <button className="edit" onClick={() => handleEdit(user)}>
                    Edit
                  </button>
                  <button className="delete" onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App

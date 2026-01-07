import { useState, useEffect } from 'react'
import './App.css'

const initialUsers = [
  { id: 1, firstName: 'TSM', lastName: 'Dev', email: 'tsmsolitions@gmail.com' },
  { id: 2, firstName: 'taing', lastName: 'siveminh', email: 'taignsiveminh@gmail.com' },
  { id: 3, firstName: 'Cr', lastName: '7', email: 'ronaldo@gmail.com' },
  { id: 4, firstName: 'neymar', lastName: 'jr', email: 'neymarjurnior@gmail.com' },
]

function App() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users')
    return saved ? JSON.parse(saved) : initialUsers
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('firstName')
  const [sortOrder, setSortOrder] = useState('asc')
  const [selectedUsers, setSelectedUsers] = useState(new Set())

  // Save to localStorage whenever users change
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users))
  }, [users])

  // Email validation
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleView = (user) => {
    alert(`Name: ${user.firstName} ${user.lastName}\nEmail: ${user.email}`)
  }

  const handleEdit = (user) => {
    const firstName = prompt('First name', user.firstName)
    if (firstName === null) return
    if (!firstName.trim()) {
      alert('First name is required')
      return
    }
    const lastName = prompt('Last name', user.lastName)
    if (lastName === null) return
    const email = prompt('Email', user.email)
    if (email === null) return
    if (email && !isValidEmail(email)) {
      alert('Please enter a valid email address')
      return
    }

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
    if (!firstName || !firstName.trim()) {
      alert('First name is required')
      return
    }
    const lastName = prompt('Last name') || ''
    const email = prompt('Email') || ''
    if (email && !isValidEmail(email)) {
      alert('Please enter a valid email address')
      return
    }

    setUsers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), firstName, lastName, email },
    ])
  }

  const handleBulkDelete = () => {
    if (selectedUsers.size === 0) {
      alert('No users selected')
      return
    }
    const confirmed = confirm(`Delete ${selectedUsers.size} user(s)?`)
    if (!confirmed) return
    setUsers((prev) => prev.filter((user) => !selectedUsers.has(user.id)))
    setSelectedUsers(new Set())
  }

  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u.id)))
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()
    return (
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  })

  // Sort filtered users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aVal = a[sortBy]?.toLowerCase() || ''
    let bVal = b[sortBy]?.toLowerCase() || ''
    if (sortOrder === 'asc') {
      return aVal.localeCompare(bVal)
    } else {
      return bVal.localeCompare(aVal)
    }
  })

  return (
    <div className="page">
      <header className="topbar">
        <h1>Full stack Application</h1>
        <button className="primary" onClick={handleAdd}>
          Add User
        </button>
      </header>

      <div className="toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="stats">
          <span className="stat-item">Total: {users.length}</span>
          <span className="stat-item">Showing: {filteredUsers.length}</span>
          {selectedUsers.size > 0 && (
            <>
              <span className="stat-item">Selected: {selectedUsers.size}</span>
              <button className="bulk-delete" onClick={handleBulkDelete}>
                Delete Selected
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>#</th>
              <th className="sortable" onClick={() => handleSort('firstName')}>
                First Name {sortBy === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="sortable" onClick={() => handleSort('lastName')}>
                Last Name {sortBy === 'lastName' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="sortable" onClick={() => handleSort('email')}>
                Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-results">
                  {searchTerm ? 'No users found matching your search' : 'No users available'}
                </td>
              </tr>
            ) : (
              sortedUsers.map((user, index) => (
                <tr key={user.id} className={selectedUsers.has(user.id) ? 'selected-row' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                    />
                  </td>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App

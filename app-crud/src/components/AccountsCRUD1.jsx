import { useState, useEffect } from 'react';

function AccountsCRUD1() {
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [editId, setEditId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 4;

//  const API = 'http://localhost:5000/accounts';
// Replace this with the actual live URL given to you by your hosting provider (like Render)
const API = 'https://onrender.com'; 

// Use the live URL for your CRUD requests
axios.get(`${API_URL}/accounts`)
  .then(res => setAccounts(res.data));

  // READ
  const fetchAccounts = () => {
    fetch(API)
      .then(res => res.json())
      .then(data => setAccounts(data));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // CREATE or UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      balance: Number(balance)
    };

    if (editId) {
      // UPDATE
      fetch(`${API}/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(() => {
        setEditId(null);
        resetForm();
        fetchAccounts();
        setCurrentPage(1);
      });

    } else {
      // CREATE
      fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(() => {
        resetForm();
        fetchAccounts();
        setCurrentPage(1);
      });
    }
  };

  // DELETE
  const handleDelete = (id) => {
    fetch(`${API}/${id}`, {
      method: 'DELETE'
    }).then(() => {
      fetchAccounts();
      setCurrentPage(1);
    });
  };

  // EDIT
  const handleEdit = (account) => {
    setEditId(account.id);
    setName(account.name);
    setBalance(account.balance);
  };

  // RESET FORM
  const resetForm = () => {
    setName('');
    setBalance('');
  };

  // -----------------------------
  // PAGINATION CALCULATION
  // -----------------------------

  // Total number of pages
  const totalPages = Math.ceil(accounts.length / accountsPerPage);

  // Starting index
  const startIndex = (currentPage - 1) * accountsPerPage;

  // Ending index
  const endIndex = startIndex + accountsPerPage;

  // Accounts for current page
  const currentAccounts = accounts.slice(startIndex, endIndex);

  return (
    <div style={{ padding: 20 }}>

      <h2>Bank Accounts (CRUD with Pagination)</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit}>

        <input
          placeholder="Account Holder Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) => setBalance(e.target.value)}
          required
        />

        <button type="submit">
          {editId ? 'Update' : 'Add'} Account
        </button>

      </form>

      {/* TABLE */}
      <table
        border="1"
        cellPadding="10"
        style={{
          marginTop: 20,
          width: '100%',
          textAlign: 'center'
        }}
      >

        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          {currentAccounts.map((acc) => (

            <tr key={acc.id}>

              <td>{acc.id}</td>

              <td>{acc.name}</td>

              <td>{acc.balance}</td>

              <td>

                <button onClick={() => handleEdit(acc)}>
                  Edit
                </button>

                <button onClick={() => handleDelete(acc.id)}>
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

      {/* PAGINATION */}
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          alignItems: 'center'
        }}
      >

        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default AccountsCRUD1;
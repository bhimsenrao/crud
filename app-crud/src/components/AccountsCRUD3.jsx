// INSTALL AXIOS: npm install axios

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

function AccountsCRUD3() {

  // ============================
  // STATE
  // ============================

  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [editId, setEditId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Number of accounts per page
  const accountsPerPage = 5;

  // Backend API
 // const API = 'http://localhost:5000/accounts';
// Replace this with the actual live URL given to you by your hosting provider (like Render)
const API = 'https://onrender.com'; 

// Use the live URL for your CRUD requests
//axios.get(`${API_URL}/accounts`)
//  .then(res => setAccounts(res.data));


  // ============================
  // READ - GET ACCOUNTS
  // ============================

  const fetchAccounts = () => {

    axios.get(API)
      .then((response) => {

        // Axios automatically converts JSON response
        // into JavaScript object/array

        setAccounts(response.data);

      })
      .catch((error) => {

        console.error('Error fetching accounts:', error);

      });

  };


  // ============================
  // COMPONENT LOAD
  // ============================

  useEffect(() => {

    fetchAccounts();

  }, []);


  // ============================
  // CREATE / UPDATE
  // ============================

  const handleSubmit = (e) => {

    e.preventDefault();

    const payload = {
      name: name,
      balance: Number(balance)
    };


    // ============================
    // UPDATE
    // ============================

    if (editId) {

      axios.put(
        API + '/' + editId,
        payload
      )
        .then((response) => {

          console.log('Account updated:', response.data);

          setEditId(null);

          resetForm();

          fetchAccounts();

        })
        .catch((error) => {

          console.error('Update error:', error);

        });

    }


    // ============================
    // CREATE
    // ============================

    else {

      axios.post(
        API,
        payload
      )
        .then((response) => {

          console.log('Account created:', response.data);

          resetForm();

          fetchAccounts();

          // Go to first page
          setCurrentPage(1);

        })
        .catch((error) => {

          console.error('Create error:', error);

        });

    }

  };


  // ============================
  // DELETE
  // ============================

  const handleDelete = (id) => {

    axios.delete(
      API + '/' + id
    )
      .then((response) => {

        console.log('Account deleted:', response.data);

        fetchAccounts();

        // Go to first page
        setCurrentPage(1);

      })
      .catch((error) => {

        console.error('Delete error:', error);

      });

  };


  // ============================
  // EDIT
  // ============================

  const handleEdit = (account) => {

    setEditId(account.id);

    setName(account.name);

    setBalance(account.balance);

  };


  // ============================
  // RESET FORM
  // ============================

  const resetForm = () => {

    setName('');

    setBalance('');

    setEditId(null);

  };


  // =================================================
  // PAGINATION
  // =================================================

  const totalPages = Math.ceil(
    accounts.length / accountsPerPage
  );


  // =================================================
  // useMemo
  // =================================================

  /*
    useMemo remembers the calculated result.

    It recalculates currentAccounts when:

    1. accounts changes
    2. currentPage changes
  */

  const currentAccounts = useMemo(() => {

    console.log('Calculating current page accounts...');

    const startIndex =
      (currentPage - 1) * accountsPerPage;

    const endIndex =
      startIndex + accountsPerPage;

    return accounts.slice(
      startIndex,
      endIndex
    );

  }, [accounts, currentPage]);


  // ============================
  // NEXT PAGE
  // ============================

  const nextPage = () => {

    if (currentPage < totalPages) {

      setCurrentPage(currentPage + 1);

    }

  };


  // ============================
  // PREVIOUS PAGE
  // ============================

  const previousPage = () => {

    if (currentPage > 1) {

      setCurrentPage(currentPage - 1);

    }

  };


  // ============================
  // JSX
  // ============================

  return (

    <div
      style={{
        padding: '20px',
        maxWidth: '900px',
        margin: 'auto'
      }}
    >

      <h2>
        Bank Accounts
      </h2>


      {/* ==========================
          FORM
          ========================== */}

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Account Holder Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />


        <input
          type="number"
          placeholder="Balance"
          value={balance}
          onChange={(e) =>
            setBalance(e.target.value)
          }
          required
        />


        <button type="submit">

          {editId ? 'Update' : 'Add'} Account

        </button>


        {/* Cancel editing */}

        {editId && (

          <button
            type="button"
            onClick={resetForm}
          >
            Cancel
          </button>

        )}

      </form>


      {/* ==========================
          TABLE
          ========================== */}

      <table
        border="1"
        cellPadding="10"
        style={{
          marginTop: '20px',
          width: '100%',
          textAlign: 'center',
          borderCollapse: 'collapse'
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

          {currentAccounts.length > 0 ? (

            currentAccounts.map((account) => (

              <tr key={account.id}>

                <td>
                  {account.id}
                </td>

                <td>
                  {account.name}
                </td>

                <td>
                  {account.balance}
                </td>

                <td>

                  <button
                    onClick={() =>
                      handleEdit(account)
                    }
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      handleDelete(account.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td colSpan="4">
                No accounts found
              </td>

            </tr>

          )}

        </tbody>

      </table>


      {/* ==========================
          PAGINATION
          ========================== */}

      <div
        style={{
          marginTop: '20px',
          textAlign: 'center'
        }}
      >

        <button
          onClick={previousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>


        <span
          style={{
            margin: '0 20px',
            fontWeight: 'bold'
          }}
        >

          Page {currentPage} of {totalPages}

        </span>


        <button
          onClick={nextPage}
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
        >
          Next
        </button>

      </div>


      {/* ==========================
          TOTAL ACCOUNTS
          ========================== */}

      <p
        style={{
          textAlign: 'center',
          marginTop: '10px'
        }}
      >

        Total Accounts: {accounts.length}

      </p>

    </div>

  );

}


export default AccountsCRUD3;

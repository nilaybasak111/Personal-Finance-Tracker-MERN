import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { type TableColumn } from "react-data-table-component";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  paymentMethod?: string | null;
  date: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchTransactions();

    const close = () => setOpenMenuId(null);
    window.addEventListener("click", close);

    return () => window.removeEventListener("click", close);
  }, []);

  // Fetching All Transactions
  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get<Transaction[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTransactions(res.data);
      recalcTotals(res.data);
    } catch {
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  //  Calculate Totals
  const recalcTotals = (data: Transaction[]) => {
    let i = 0;
    let e = 0;

    data.forEach((tx) => {
      tx.type === "income" ? (i += tx.amount) : (e += tx.amount);
    });

    setIncome(i);
    setExpense(e);
  };

  const balance = income - expense;

  // Delete Transaction
  const deleteTransaction = async (id: string) => {
    if (!window.confirm("Delete this transaction?")) return;

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updated = transactions.filter((t) => t._id !== id);

      setTransactions(updated);
      recalcTotals(updated);
      setOpenMenuId(null);
    } catch {
      setError("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Update or Edit Transaction
  const updateTransaction = async () => {
    if (!editTx) return;

    try {
      setActionLoading(true);

      const token = localStorage.getItem("token");

      const payload = {
        type: editTx.type,
        amount: editTx.amount,
        category: editTx.category,
        description: editTx.description,
        paymentMethod: editTx.paymentMethod,
        date: editTx.date,
      };

      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions/${editTx._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // console.log("Updated Transaction: ", res.data);

      await fetchTransactions();

      // Close Edit Modal
      setEditTx(null);
    } catch {
      setError("Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  const columns: TableColumn<Transaction>[] = [
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString(),
      width: "100px",
    },
    {
      name: "Type",
      cell: (row) => (
        <span
          className={`capitalize px-2 py-1 rounded-full text-xs ${
            row.type === "income"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.type}
        </span>
      ),
      width: "140px",
    },
    {
      name: "Category",
      cell: (row) => <span className="capitalize">{row.category}</span>,
      width: "160px",
    },
    {
      name: "Payment",
      cell: (row) => (
        <span className="uppercase font-medium">
          {row.paymentMethod || "N/A"}
        </span>
      ),
      width: "140px",
    },
    {
      name: "Description",
      cell: (row) => (
        <span className="capitalize">
          {row.description || "No description"}{" "}
        </span>
      ),
      grow: 1,
    },
    {
      name: "Amount",
      cell: (row) => <b>₹{row.amount}</b>,
      width: "180px",
    },
    {
      name: "",
      width: "50px",
      cell: (row) => (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() =>
              setOpenMenuId(openMenuId === row._id ? null : row._id)
            }
          >
            ⋮
          </button>

          {openMenuId === row._id && (
            <div className="absolute right-0 bg-white border shadow rounded w-32 z-20">
              <button
                onClick={() => {
                  setEditTx({ ...row });
                  setOpenMenuId(null);
                }}
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTransaction(row._id)}
                className="block w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">Dashboard</h1>

      {/* Dashboard Summary */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-5 rounded shadow">
          <p>Total Income</p>
          <h2 className="text-2xl font-bold">₹{income}</h2>
        </div>

        <div className="bg-red-100 p-5 rounded shadow">
          <p>Total Expense</p>
          <h2 className="text-2xl font-bold">₹{expense}</h2>
        </div>

        <div className="bg-blue-100 p-5 rounded shadow">
          <p>Balance</p>
          <h2 className="text-2xl font-bold">₹{balance}</h2>
        </div>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Table */}
      <div className="bg-white p-6 rounded shadow">
        <DataTable
          columns={columns}
          data={transactions}
          progressPending={loading}
          pagination
          highlightOnHover
          responsive
        />
      </div>

      {/* Edit Modal */}
      {editTx && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="font-bold mb-4">Edit Transaction</h3>

            {/* Type */}
            <select
              value={editTx.type}
              onChange={(e) =>
                setEditTx({
                  ...editTx,
                  type: e.target.value as any,
                })
              }
              className="border w-full mb-3 p-2"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            {/* Amount */}
            <input
              type="number"
              value={editTx.amount}
              onChange={(e) =>
                setEditTx({
                  ...editTx,
                  amount: Number(e.target.value),
                })
              }
              className="border w-full mb-3 p-2"
            />

            {/* Category */}
            <input
              type="text"
              value={editTx.category}
              onChange={(e) =>
                setEditTx({
                  ...editTx,
                  category: e.target.value,
                })
              }
              className="border w-full mb-3 p-2"
            />

            {/* Description */}
            <input
              type="text"
              value={editTx.description || ""}
              onChange={(e) =>
                setEditTx({
                  ...editTx,
                  description: e.target.value,
                })
              }
              className="border w-full mb-3 p-2"
            />

            {/* Payment */}
            <select
              value={editTx.paymentMethod || ""}
              onChange={(e) =>
                setEditTx({
                  ...editTx,
                  paymentMethod: e.target.value,
                })
              }
              className="border w-full mb-4 p-2"
            >
              <option value="">Select Payment</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditTx(null)}
                className="border px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={updateTransaction}
                disabled={actionLoading}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                {actionLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

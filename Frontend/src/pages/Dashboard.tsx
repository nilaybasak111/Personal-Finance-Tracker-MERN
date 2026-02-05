import { useEffect, useState } from "react";
import axios from "axios";
import DataTable, { type TableColumn } from "react-data-table-component";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  date: string;
}

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: Transaction[] = res.data;

      setTransactions(data);

      let totalIncome = 0;
      let totalExpense = 0;

      data.forEach((tx) => {
        if (tx.type === "income") {
          totalIncome += tx.amount;
        } else {
          totalExpense += tx.amount;
        }
      });

      setIncome(totalIncome);
      setExpense(totalExpense);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to Load Transactions");
    } finally {
      setLoading(false);
    }
  };

  const balance = income - expense;

  const columns: TableColumn<Transaction>[] = [
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
    },
    {
      name: "Type",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.type === "income"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.type}
        </span>
      ),
    },
    {
      name: "Category",
      selector: (row) =>
        row.category.charAt(0).toUpperCase() + row.category.slice(1),
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Description",
      cell: (row) =>
        row.description
          ? row.description.charAt(0).toUpperCase() + row.description.slice(1)
          : "No description",
      grow: 1,
      maxWidth: "250px",
    },
    {
      name: "Amount",
      selector: (row) => row.amount,
      sortable: true,
      right: true,
      width: "120px",
      cell: (row) => <span className="font-semibold">₹{row.amount}</span>,
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
        Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Income */}
        <div className="bg-green-100 p-5 rounded-xl shadow">
          <p className="text-sm text-green-700">Total Income</p>
          <h2 className="text-2xl font-bold text-green-800">₹{income}</h2>
        </div>

        {/* Expense */}
        <div className="bg-red-100 p-5 rounded-xl shadow">
          <p className="text-sm text-red-700">Total Expense</p>
          <h2 className="text-2xl font-bold text-red-800">₹{expense}</h2>
        </div>

        {/* Balance */}
        <div className="bg-blue-100 p-5 rounded-xl shadow">
          <p className="text-sm text-blue-700">Balance</p>
          <h2
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-blue-800" : "text-red-600"
            }`}
          >
            ₹{balance}
          </h2>
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Data Table */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Recent Transactions
        </h2>

        <DataTable
          columns={columns}
          data={transactions}
          progressPending={loading}
          pagination
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30, 50]}
          highlightOnHover
          responsive
          persistTableHead
          noDataComponent="No Transactions Found"
          customStyles={{
            headCells: {
              style: {
                fontWeight: "bold",
                fontSize: "15px",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
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
      setError(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const balance = income - expense;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-center text-3xl font-bold mb-6 text-gray-800">
        DashBoard
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

      {/* Status */}
      {loading && (
        <p className="text-gray-500 text-center">Loading Dashboard...</p>
      )}

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Transactions Table */}
      {!loading && !error && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Recent Transactions
          </h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center">No transactions found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-left">
                    <th className="py-3 px-3">Date</th>
                    <th className="px-3">Type</th>
                    <th className="px-3">Category</th>
                    <th className="px-3">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-3">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>

                      <td className="px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            tx.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      <td className="px-3">
                        {tx.category.charAt(0).toUpperCase() +
                          tx.category.slice(1)}
                      </td>

                      <td className="px-3 font-semibold">₹{tx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

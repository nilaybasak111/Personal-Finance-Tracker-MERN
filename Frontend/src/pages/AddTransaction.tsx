import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface AITransaction {
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  paymentMethod?: string | null;
  confidence?: number;
}

const AddTransaction: React.FC = () => {
  const navigate = useNavigate();

  const [text, setText] = useState<string>("");

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const [aiResults, setAiResults] = useState<AITransaction[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const analyzeText = async () => {
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    try {
      setAiLoading(true);
      setError("");
      setAiResults([]);

      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/ai/parse`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const transactions: AITransaction[] = res.data?.transactions || [];

      if (!transactions.length) {
        setError("AI could not detect transactions");
        return;
      }

      setAiResults(transactions);
    } catch (err) {
      console.error(err);
      setError("AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  const clearAI = () => {
    setAiResults([]);
    setText("");
  };

  const saveAITransactions = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions/bulk`,
        {
          transactions: aiResults,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("AI Transactions Saved Successfully");

      setAiResults([]);
      setText("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError("Failed to save AI transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (aiResults.length > 0) return;

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!amount || !category || !date) {
        setError("All fields are required");
        return;
      }

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/transactions`,
        {
          type,
          amount: Number(amount),
          category,
          date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess("Transaction saved successfully");

      setAmount("");
      setCategory("");
      setDate("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError("Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Add Transaction
      </h1>

      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* AI Input */}
        <div className="mb-6">
          <label className="block font-medium mb-2">Smart Input (AI)</label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder='e.g. "Got 10000, spent 2000 shopping"'
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />

            <button
              type="button"
              onClick={analyzeText}
              disabled={aiLoading}
              className="bg-purple-600 text-white px-4 rounded hover:bg-purple-700 disabled:opacity-60"
            >
              {aiLoading ? "..." : "Analyze"}
            </button>
          </div>
        </div>

        {/* AI Preview */}
        {aiResults.length > 0 && (
          <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-purple-700">
                AI Detected Transactions
              </h3>

              <div className="flex gap-2">
                {/* Save Button */}
                <button
                  type="button"
                  onClick={saveAITransactions}
                  disabled={loading}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-60 text-sm"
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                {/* Clear Button */}
                <button
                  type="button"
                  onClick={clearAI}
                  className="text-sm text-red-600 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Items */}
            {aiResults.map((tx, index) => (
              <div
                key={index}
                className="flex justify-between items-center mb-2 p-2 bg-white rounded shadow-sm"
              >
                <div>
                  <p className="font-medium capitalize">{tx.type}</p>

                  <p className="text-sm text-gray-600">{tx.description}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">₹{tx.amount}</p>

                  <p className="text-xs text-gray-500">{tx.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <hr className="mb-6" />

        {/* Manual Form Submit Section */}
        <form
          onSubmit={handleSubmit}
          className={
            aiResults.length > 0 ? "opacity-60 pointer-events-none" : ""
          }
        >
          {/* Type */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Type</label>

            <select
              value={type}
              onChange={(e) => setType(e.target.value as "income" | "expense")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Amount</label>

            <input
              type="number"
              value={amount || ""}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Category</label>

            <input
              type="text"
              value={category || ""}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Date</label>

            <input
              type="date"
              value={date || ""}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Messages */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Manual Transaction"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;

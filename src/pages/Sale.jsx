import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Sale() {
  const [form, setForm] = useState({ customerId: "", amount: "", date: "" });
  const [status, setStatus] = useState("");
  const [customers, setCustomers] = useState([]);
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await axios.get("http://localhost:4000/api/v1/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(res.data);
    };
    fetchCustomers();
  }, [token]);

  useEffect(() => {
    const customerIdFromQuery = searchParams.get("customerId");
    if (customerIdFromQuery) {
      setForm((prev) => ({ ...prev, customerId: customerIdFromQuery }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!form.customerId) return;
    const fetchHistory = async () => {
      const res = await axios.get(`http://localhost:4000/api/v1/orders?customerId=${form.customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    };
    fetchHistory();
  }, [form.customerId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirm = window.confirm(
      `Confirm Sale:\nCustomer: ${form.customerId}\nAmount: ₨${form.amount}\nDate: ${form.date}`
    );
    if (!confirm) return;

    try {
      await axios.post(
        "http://localhost:4000/api/v1/orders",
        {
          customerId: form.customerId,
          amount: parseFloat(form.amount),
          createdAt: form.date,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus("Sale recorded successfully.");
      setForm({ customerId: "", amount: "", date: "" });
      setHistory([]);
    } catch (err) {
      setStatus("Error recording sale.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">New Sale</h2>
        {status && <p className="mb-4 text-green-600">{status}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Customer</label>
            <select
              name="customerId"
              value={form.customerId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Amount (₨)</label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit Sale
          </button>
        </form>

        {history.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-2">Sale History</h3>
            <table className="w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Amount (₨)</th>
                </tr>
              </thead>
              <tbody>
                {history.map((sale) => (
                  <tr key={sale.id}>
                    <td className="border px-2 py-1">{new Date(sale.createdAt).toLocaleDateString()}</td>
                    <td className="border px-2 py-1">{sale.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sale;

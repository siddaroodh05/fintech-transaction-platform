import Nav from "../components/Nav";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";
import "../styles/Dashboard.css";

const transactions = [
  { id: 1, type: "credit", name: "Salary", amount: 50000 },
  { id: 2, type: "debit", name: "Groceries", amount: 3200 },
  { id: 3, type: "debit", name: "Electricity Bill", amount: 1800 },
  { id: 4, type: "credit", name: "Freelance", amount: 12000 }
];

const weeklyExpense = [
  { week: "Mon", amount: 800 },
  { week: "Tue", amount: 1200 },
  { week: "Wed", amount: 600 },
  { week: "Thu", amount: 1500 },
  { week: "Fri", amount: 2000 },
  { week: "Sat", amount: 900 },
  { week: "Sun", amount: 1100 }
];

const pieData = [
  { name: "Food", value: 4000 },
  { name: "Bills", value: 2500 },
  { name: "Shopping", value: 1800 }
];

const COLORS = ["#4f46e5", "#22c55e", "#f97316"];

export default function Dashboard() {
  const credited = transactions
    .filter((t) => t.type === "credit")
    .reduce((a, b) => a + b.amount, 0);

  const debited = transactions
    .filter((t) => t.type === "debit")
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="dashboard">
      <Nav />

      <div className="dashboard-content">
        <div className="left">
          <div className="summary">
            <div className="card">
              <h3>This Month Credited</h3>
              <p className="credit">₹{credited}</p>
            </div>

            <div className="card">
              <h3>This Month Debited</h3>
              <p className="debit">₹{debited}</p>
            </div>
          </div>

          <div className="bank-bar">
            <div className="bank-info">
              <Landmark className="bank-icon" />
              <div>
                <p className="bank-name">HDFC Bank</p>
                <p className="account-holder">
                  Siddaroodh Venkatapur
                </p>
              </div>
            </div>

            <button className="check-balance-btn">
              Check Balance
            </button>
          </div>

          <div className="analytics">
            <div className="card">
              <h3>Weekly Expense</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyExpense}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3>Expense Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    outerRadius={90}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="right">
          <h2>Transaction History</h2>

          {transactions.map((t) => (
            <div key={t.id} className="transaction">
              <div className="txn-left">
                {t.type === "credit" ? (
                  <ArrowDownCircle className="icon credit" />
                ) : (
                  <ArrowUpCircle className="icon debit" />
                )}

                <div>
                  <p className="name">{t.name}</p>
                  <p className="type">{t.type}</p>
                </div>
              </div>

              <div className="txn-right">
                <p className="amount">₹{t.amount}</p>
                <button className="pay-again">
                  Pay Again
                </button>
              </div>
            </div>
          ))}

          <div className="view-all-wrapper">
            <button className="view-all-btn">
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

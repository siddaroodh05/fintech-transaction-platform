
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Landmark,
  RefreshCcw
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { useState, useEffect, useMemo } from "react";
import { GetTransactionHistory } from "../api/transiction";
import timeAgo from "../utills/Time_convertor";
import { useAccountStore } from "../store/useAccountStore";
import { useAuthStore } from "../store/useAuthStore";



export default function Dashboard() {
  const [transaction, setTransaction] = useState([]);
  const Navigate = useNavigate();
  const { account } = useAccountStore();


  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      // Navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, Navigate]);
  


  const fetchTransactionHistory = async (since = null) => {
    try {
      const response = await GetTransactionHistory(50, since);
      if (!response || response.length === 0) return;

      setTransaction(prev => {
        const existingIds = new Set(prev.map(tx => tx.id));
        const filtered = response.filter(tx => !existingIds.has(tx.id));
        const merged = [...filtered, ...prev];

        sessionStorage.setItem("transactions", JSON.stringify(merged));
        return merged;
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
  
    const savedTxns = sessionStorage.getItem("transactions");
  
    if (savedTxns) {
      const parsed = JSON.parse(savedTxns);
      setTransaction(parsed);
  
      const latest = parsed
        .map(tx => tx.date)
        .sort((a, b) => new Date(b) - new Date(a))[0];
  
      fetchTransactionHistory(latest);
    } else {
      fetchTransactionHistory();
    }
  }, [isAuthenticated]);
  
  const groupedTransactions = useMemo(() => {
    return transaction.reduce((groups, txn) => {
      const date = new Date(txn.date);
      const monthYear = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!groups[monthYear]) {
        groups[monthYear] = { transactions: [], credited: 0, debited: 0 };
      }

      groups[monthYear].transactions.push(txn);

      if (txn.type === "CREDIT") {
        groups[monthYear].credited += txn.amount;
      } else {
        groups[monthYear].debited += txn.amount;
      }

      return groups;
    }, {});
  }, [transaction]);

  const latestTimestamp = useMemo(() => {
    if (transaction.length === 0) return null;
    return transaction
      .map(tx => tx.date)
      .sort((a, b) => new Date(b) - new Date(a))[0];
  }, [transaction]);

 
  const weeklyExpense = [
    { week: "Week 1", amount: 1200 },
    { week: "Week 2", amount: 900 },
    { week: "Week 3", amount: 1500 },
    { week: "Week 4", amount: 700 },
  ];

  const pieData = [
    { name: "Food", value: 400 },
    { name: "Shopping", value: 300 },
    { name: "Travel", value: 200 },
    { name: "Others", value: 100 },
  ];

  const COLORS = ["#3b82f6", "#22c55e", "#ef4444", "#f59e0b"];

  return (
    <div className="dashboard">
     

      <div className="dashboard-content">
        <div className="left">
          <div className="bank-bar">
            <div className="bank-info">
              <Landmark className="bank-icon" />
              <div>
                <p className="bank-name">FineTech Bank</p>
                <p className="account-holder">{account?.holder_name || "Loading..."}</p>
              </div>
            </div>

            <button
              className="check-balance-btn"
              onClick={() =>
                Navigate("/verify-pin", { state: { action: "CHECK_BALANCE" } })
              }
            >
              Check Balance
            </button>
          </div>

          {/* ANALYTICS COMPONENT */}
          <div className="analytics">
            <div className="card">
              <h3>Weekly Expense</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weeklyExpense}>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3>Expense Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" outerRadius={90}>
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
          <div className="txn-header">
            <h2>Transaction History</h2>
            <RefreshCcw
              className="refresh-icon"
              onClick={() => fetchTransactionHistory(latestTimestamp)}
            />
          </div>

          <div className="txn-scroll">
            {transaction.length === 0 ? (
              <p className="no-transactions">No transactions yet</p>
            ) : (
              Object.entries(groupedTransactions).map(([month, data]) => (
                <div key={month} className="month-section">
                  <div className="month-header">
                    <p className="month-title">{month}</p>
                    <div className="month-summary">
                      <span className="month-chip credit">
                        +₹{data.credited.toFixed(2)}
                      </span>
                      <span className="month-chip debit">
                        -₹{data.debited.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {data.transactions.map(t => (
                    <div className="transaction" key={t.id}>
                      <div className="txn-left">
                        {t.type === "CREDIT" ? (
                          <ArrowDownCircle className="icon credit" />
                        ) : (
                          <ArrowUpCircle className="icon debit" />
                        )}

                        <div className="txn-text">
                          <p className="title">
                            {t.type === "CREDIT" ? "Received from" : "Paid to"}
                          </p>
                          <p className="name">{t.name}</p>
                          <p className="type">{timeAgo(t.date)}</p>
                        </div>
                      </div>

                      <div className="txn-right">
                        <p className="amount">₹{t.amount.toFixed(2)}</p>
                        <p className="txn-sub">
                          {t.type === "CREDIT"
                            ? `Credited to XXX${t.acc.slice(-4)}`
                            : `Debited from XXX${t.acc.slice(-4)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

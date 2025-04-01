"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar"; 

interface Transaction {
  _id: string;
  price: number;
  userId: string;
  name: string;
  address: string;
  status: string;
}

const PaymentFailed = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { transactionid } = useParams();

  useEffect(() => {
    if (!transactionid) {
      console.error("Transaction ID not found in URL.");
      setLoading(false);
      return;
    }

    const apiUrl = `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/transactions/transaction/${transactionid}`;
    console.log("Fetching transaction from:", apiUrl);

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("API Response:", data);
        if (data.success && data.transaction) {
          setTransaction(data.transaction);
        } else {
          console.error("Invalid API response:", data);
        }
      })
      .catch((err) => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, [transactionid]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
  }

  if (!transaction) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Transaction not found.</p>
      </div>
    );
  }

  return (
    <div className="flex bg-white min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6">
        <div className="bg-white shadow-2xl rounded-lg p-6 w-full max-w-lg mx-auto">
          <h2 className="text-3xl font-semibold text-red-600 text-center">Payment Failed</h2>
          <p className="mt-4 text-gray-700 text-center">We encountered an issue while processing your payment. Please try again later.</p>

          <div className="mt-6 border-t pt-6 space-y-4">
            <p className="text-lg"><strong>Transaction ID:</strong> {transaction._id}</p>
            <p className="text-lg"><strong>Name:</strong> {transaction.name}</p>
            <p className="text-lg"><strong>Address:</strong> {transaction.address}</p>
            <p className="text-lg"><strong>Amount:</strong> BDT {transaction.price}</p>
            <p className="text-lg"><strong>Status:</strong> {transaction.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;

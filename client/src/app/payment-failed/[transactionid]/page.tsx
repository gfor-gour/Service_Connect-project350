"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!transaction) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Transaction not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-red-600">Payment Failed</h2>
        <p className="mt-2 text-gray-600">Your payment could not be processed. Please try again.</p>

        <div className="mt-4 border-t pt-4">
          <p><strong>Transaction ID:</strong> {transaction._id}</p>
          <p><strong>Name:</strong> {transaction.name}</p>
          <p><strong>Address:</strong> {transaction.address}</p>
          <p><strong>Amount:</strong> BDT {transaction.price}</p>
          <p><strong>Status:</strong> {transaction.status}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
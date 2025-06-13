"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Sidebar from "../../components/Sidebar";

interface Transaction {
  _id: string;
  price: number;
  userId: string;
  name: string;
  address: string;
  status: string;
}

const PaymentSuccess = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const { transactionid } = useParams(); // Get the dynamic transaction ID

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

  const downloadPDF = () => {
    if (!transaction) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Payment Receipt", 80, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: [
        ["Transaction ID", transaction._id],
        ["Name", transaction.name],
        ["Address", transaction.address],
        ["Amount", `BDT ${transaction.price}`],
        ["Status", transaction.status],
      ],
    });

    doc.save(`payment_receipt_${transaction._id}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
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
      <div className="flex-1 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg mx-auto">
          <h2 className="text-2xl font-semibold text-green-600">
            Payment Successful
          </h2>
          <p className="mt-2 text-gray-800">Thank you for your payment!</p>

          <div className="mt-4 border-t pt-4">
            <p>
              <strong>Transaction ID:</strong> {transaction._id}
            </p>
            <p>
              <strong>Name:</strong> {transaction.name}
            </p>
            <p>
              <strong>Address:</strong> {transaction.address}
            </p>
            <p>
              <strong>Amount:</strong> BDT {transaction.price}
            </p>
            <p>
              <strong>Status:</strong> {transaction.status}
            </p>
          </div>
          <button
            onClick={downloadPDF}
            className="mt-4 text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const bookingId = searchParams.get("booking_id");
  const navigate = useNavigate();
  const [hasConfirmed, setHasConfirmed] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      if (hasConfirmed) return;

      try {
        const session = await axiosInstance.get(
          `/payment/session-status?session_id=${sessionId}`
        );

        if (session.data.status === "complete") {
          await axiosInstance.put("/booking/update-payment-status", {
            bookingId,
            session_Id: sessionId,
          });

          setHasConfirmed(true);

          setTimeout(() => {
            navigate("/user/booking", { state: { paymentSuccess: true } });
          }, 2000);
        }
      } catch (error) {
        console.error("Error confirming payment:", error);
      }
    };

    if (sessionId && bookingId && !hasConfirmed) {
      confirmPayment();
    }
  }, [sessionId, bookingId, navigate, hasConfirmed]);

  return (
    <div className="text-center mt-10 h-screen">
      <h2 className="text-3xl text-green-600">✅ Payment Successful!</h2>
      <p className="mt-4">Updating your booking status...</p>
      <div className="mt-6 animate-spin border-t-4 border-green-500 border-solid rounded-full h-10 w-10 mx-auto"></div>
    </div>
  );
};

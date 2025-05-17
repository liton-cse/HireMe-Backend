// Mock payment processing
export const processPayment = async (applicationId, paymentMethod) => {
  // In a real app, this would call Stripe/SSLcommerz API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `txn_${Math.random().toString(36).slice(2, 11)}`,
      });
    }, 1000);
  });
};

import React from 'react';
import { CheckCircle, Download, Share } from 'lucide-react';
import { WaterRequest } from '../types';

interface PaymentSuccessProps {
  isOpen: boolean;
  onClose: () => void;
  request: WaterRequest;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({ isOpen, onClose, request }) => {
  if (!isOpen) return null;

  const getPaymentMethodText = () => {
    if (!request.paymentMethod) return 'Cash on Delivery';
    
    const { type, provider } = request.paymentMethod;
    
    if (type === 'cod') return 'Cash on Delivery';
    if (type === 'upi' && provider) {
      const providerNames: Record<string, string> = {
        gpay: 'Google Pay',
        phonepe: 'PhonePe',
        paytm: 'Paytm',
        amazonpay: 'Amazon Pay'
      };
      return providerNames[provider] || 'UPI Payment';
    }
    if (type === 'wallet' && provider) {
      return provider === 'paytm' ? 'Paytm Wallet' : 'Amazon Pay';
    }
    if (type === 'card' && provider) {
      const cardNames: Record<string, string> = {
        visa: 'Visa Card',
        mastercard: 'Mastercard',
        rupay: 'RuPay Card'
      };
      return cardNames[provider] || 'Card Payment';
    }
    
    return 'Payment Completed';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmed!</h3>
        <p className="text-gray-600 mb-6">Your water cane request has been placed successfully</p>
        
        <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Order ID</span>
            <span className="font-semibold text-gray-800">#{request.id.slice(-6).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount</span>
            <span className="font-semibold text-gray-800">₹{request.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method</span>
            <span className="font-semibold text-gray-800">{getPaymentMethodText()}</span>
          </div>
          {request.paymentMethod?.type !== 'cod' && (
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-semibold text-gray-800">
                {request.transactionId || 'TXN' + Date.now().toString().slice(-8)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className="font-semibold text-green-600">
              {request.paymentMethod?.type === 'cod' ? 'Confirmed' : 'Paid'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3 mb-6">
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center">
            <Download className="h-5 w-5 mr-2" />
            Download
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center">
            <Share className="h-5 w-5 mr-2" />
            Share
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          Continue
        </button>
        
        <p className="text-sm text-gray-500 mt-4">
          You will receive updates about your delivery via SMS
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
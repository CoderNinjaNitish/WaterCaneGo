import React, { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Banknote, X, Check, AlertCircle } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSelect: (method: PaymentMethod) => void;
  amount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onPaymentSelect, amount }) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const paymentOptions = [
    {
      type: 'upi' as const,
      title: 'UPI Payment',
      icon: Smartphone,
      providers: [
        { id: 'gpay', name: 'Google Pay', color: 'bg-blue-500' },
        { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-600' },
        { id: 'paytm', name: 'Paytm', color: 'bg-blue-600' },
        { id: 'amazonpay', name: 'Amazon Pay', color: 'bg-orange-500' }
      ]
    },
    {
      type: 'wallet' as const,
      title: 'Digital Wallet',
      icon: Wallet,
      providers: [
        { id: 'paytm', name: 'Paytm Wallet', color: 'bg-blue-600' },
        { id: 'amazonpay', name: 'Amazon Pay', color: 'bg-orange-500' }
      ]
    },
    {
      type: 'card' as const,
      title: 'Credit/Debit Card',
      icon: CreditCard,
      providers: [
        { id: 'visa', name: 'Visa', color: 'bg-blue-700' },
        { id: 'mastercard', name: 'Mastercard', color: 'bg-red-600' },
        { id: 'rupay', name: 'RuPay', color: 'bg-green-600' }
      ]
    }
  ];

  const handlePaymentSelect = async (type: PaymentMethod['type'], provider?: string) => {
    if (type === 'cod') {
      onPaymentSelect({ type: 'cod' });
      onClose();
      return;
    }

    if (type === 'upi' && !provider) {
      setSelectedMethod({ type: 'upi' });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentMethod: PaymentMethod = {
      type,
      provider: provider as any,
      details: type === 'upi' ? upiId : `****${Math.floor(Math.random() * 9000) + 1000}`
    };
    
    onPaymentSelect(paymentMethod);
    setIsProcessing(false);
    onClose();
  };

  const handleUpiSubmit = () => {
    if (upiId.trim()) {
      handlePaymentSelect('upi', 'custom');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Choose Payment Method</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="mt-2">
            <p className="text-2xl font-bold text-cyan-600">₹{amount}</p>
            <p className="text-sm text-gray-600">125L Filtered Water Cane</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Cash on Delivery */}
          <button
            onClick={() => handlePaymentSelect('cod')}
            className="w-full bg-green-50 border-2 border-green-200 rounded-xl p-4 hover:border-green-300 transition-colors"
          >
            <div className="flex items-center">
              <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <Banknote className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Cash on Delivery</p>
                <p className="text-sm text-gray-600">Pay when water cane is delivered</p>
              </div>
            </div>
          </button>

          {/* UPI Custom Input */}
          {selectedMethod?.type === 'upi' && (
            <div className="bg-blue-50 rounded-xl p-4 space-y-4">
              <h4 className="font-semibold text-gray-800">Enter UPI ID</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={handleUpiSubmit}
                  disabled={!upiId.trim() || isProcessing}
                  className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Pay
                </button>
              </div>
            </div>
          )}

          {/* Payment Options */}
          {paymentOptions.map((option) => (
            <div key={option.type} className="space-y-2">
              <div className="flex items-center mb-3">
                <option.icon className="h-5 w-5 text-gray-600 mr-2" />
                <h4 className="font-semibold text-gray-800">{option.title}</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {option.providers.map((provider) => (
                  <button
                    key={provider.id}
                    onClick={() => handlePaymentSelect(option.type, provider.id)}
                    disabled={isProcessing}
                    className="bg-white border-2 border-gray-200 rounded-xl p-3 hover:border-cyan-300 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${provider.color} flex items-center justify-center mr-3`}>
                        <span className="text-white text-xs font-bold">
                          {provider.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-800">{provider.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Processing State */}
          {isProcessing && (
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-blue-600 font-semibold">Processing Payment...</p>
              <p className="text-sm text-gray-600">Please wait while we process your payment</p>
            </div>
          )}

          {/* Security Note */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-800">Secure Payment</p>
              <p className="text-xs text-gray-600">Your payment information is encrypted and secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
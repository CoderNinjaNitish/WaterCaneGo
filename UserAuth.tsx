import React, { useState } from 'react';
import { User, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateMockLocation } from '../utils/location';

interface UserAuthProps {
  onBack: () => void;
}

const UserAuth: React.FC<UserAuthProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const location = generateMockLocation();
    
    const user: User = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      location: {
        ...location,
        address: address.trim() || location.address
      },
      role: 'user'
    };

    login(user);
    setIsLoading(false);
  };

  const handleGetLocation = () => {
    const location = generateMockLocation();
    setAddress(location.address);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Customer Login</h2>
          </div>

          <div className="text-center mb-8">
            <div className="bg-cyan-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-10 w-10 text-cyan-600" />
            </div>
            <p className="text-gray-600">Enter your details to start ordering water canes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Address
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your address"
                />
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <MapPin className="h-5 w-5" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !name.trim() || !phone.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Setting up your account...
                </div>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            By continuing, you agree to our terms of service and privacy policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAuth;
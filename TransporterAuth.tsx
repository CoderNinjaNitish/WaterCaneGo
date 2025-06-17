import React, { useState } from 'react';
import { Truck, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateMockLocation } from '../utils/location';

interface TransporterAuthProps {
  onBack: () => void;
}

const TransporterAuth: React.FC<TransporterAuthProps> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const vehicleTypes = ['Bike', 'Auto', 'Van', 'Truck'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !vehicleType) return;

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
      role: 'transporter',
      vehicleType,
      isOnline: true
    };

    login(user);
    setIsLoading(false);
  };

  const handleGetLocation = () => {
    const location = generateMockLocation();
    setAddress(location.address);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={onBack}
              className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Transporter Registration</h2>
          </div>

          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-10 w-10 text-blue-600" />
            </div>
            <p className="text-gray-600">Join our delivery network and start earning</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <label htmlFor="vehicle" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Type
              </label>
              <select
                id="vehicle"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select your vehicle type</option>
                {vehicleTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Current Location
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your current location"
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
              disabled={isLoading || !name.trim() || !phone.trim() || !vehicleType}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Setting up your account...
                </div>
              ) : (
                'Start Delivering'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            By registering, you agree to our delivery partner terms and conditions
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterAuth;
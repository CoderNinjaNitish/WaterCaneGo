import React from 'react';
import { MapPin, Droplets, Truck, Star, Clock, Shield } from 'lucide-react';

interface HomeProps {
  onUserLogin: () => void;
  onTransporterLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ onUserLogin, onTransporterLogin }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <Droplets className="h-8 w-8 text-cyan-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">WaterCaneGo</h1>
          </div>
          <p className="text-center text-gray-600 mt-2">Instant 15L Water Cane Delivery</p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Fresh Water Delivered to Your Doorstep
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Order premium 125L filtered water canes with just a few taps
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={onUserLogin}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Droplets className="inline-block mr-2 h-5 w-5" />
              Order Water Now
            </button>
            
            <button
              onClick={onTransporterLogin}
              className="bg-white text-cyan-600 border-2 border-cyan-500 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Truck className="inline-block mr-2 h-5 w-5" />
              Become a Transporter
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-cyan-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
            <p className="text-gray-600">Get your water cane delivered within 30 minutes</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Tracking</h3>
            <p className="text-gray-600">Track your delivery in real-time from pickup to drop</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Pure Quality</h3>
            <p className="text-gray-600">Premium filtered water with quality guarantee</p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-800 text-center mb-8">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">1</div>
              <h4 className="font-semibold text-gray-800 mb-2">Request</h4>
              <p className="text-gray-600 text-sm">Tap to request a 125L water cane</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">2</div>
              <h4 className="font-semibold text-gray-800 mb-2">Match</h4>
              <p className="text-gray-600 text-sm">Get matched with nearest transporter</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">3</div>
              <h4 className="font-semibold text-gray-800 mb-2">Track</h4>
              <p className="text-gray-600 text-sm">Monitor delivery status in real-time</p>
            </div>
            <div className="text-center">
              <div className="bg-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">4</div>
              <h4 className="font-semibold text-gray-800 mb-2">Delivered</h4>
              <p className="text-gray-600 text-sm">Fresh water delivered to your door</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-cyan-600">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-600">500+</div>
            <div className="text-gray-600">Active Transporters</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-600">15 min</div>
            <div className="text-gray-600">Avg Delivery Time</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-cyan-600 flex items-center justify-center">
              4.8 <Star className="h-6 w-6 ml-1 fill-current" />
            </div>
            <div className="text-gray-600">User Rating</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-4">
            <Droplets className="h-6 w-6 text-cyan-400 mr-2" />
            <span className="text-xl font-semibold">WaterCaneGo</span>
          </div>
          <p className="text-gray-400">Bringing fresh water to your doorstep, one cane at a time.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
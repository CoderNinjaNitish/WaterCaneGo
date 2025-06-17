import React, { useState, useEffect } from 'react';
import { Droplets, MapPin, Clock, Phone, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRequests } from '../contexts/RequestContext';

const UserDashboard: React.FC = () => {
  const { currentUser, logout, updateLocation } = useAuth();
  const { activeRequest, createRequest, cancelRequest, updateRequestStatus } = useRequests();
  const [isRequesting, setIsRequesting] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    // Simulate status updates for active requests
    if (activeRequest && activeRequest.status === 'accepted') {
      const timer = setTimeout(() => {
        updateRequestStatus(activeRequest.id, 'on_the_way');
      }, 5000);
      return () => clearTimeout(timer);
    }
    
    if (activeRequest && activeRequest.status === 'on_the_way') {
      const timer = setTimeout(() => {
        updateRequestStatus(activeRequest.id, 'delivered');
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [activeRequest, updateRequestStatus]);

  const handleRequestWater = async () => {
    if (!currentUser || activeRequest) return;

    setIsRequesting(true);
    
    // Simulate request processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    createRequest({
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      pickupLocation: currentUser.location
    });
    
    setIsRequesting(false);
  };

  const handleCancelRequest = () => {
    if (activeRequest) {
      cancelRequest(activeRequest.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'on_the_way': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Finding nearest transporter...';
      case 'accepted': return 'Transporter on the way';
      case 'on_the_way': return 'Water cane being delivered';
      case 'delivered': return 'Delivered successfully';
      default: return status;
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Droplets className="h-8 w-8 text-cyan-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">WaterCaneGo</h1>
                <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfile(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <User className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Location */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start">
            <MapPin className="h-6 w-6 text-cyan-500 mr-3 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-1">Delivery Location</h3>
              <p className="text-gray-600">{currentUser.location.address}</p>
              <button className="text-cyan-600 text-sm mt-2 hover:underline">
                Change location
              </button>
            </div>
          </div>
        </div>

        {/* Active Request or Request Button */}
        {activeRequest ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Your Order</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activeRequest.status)}`}>
                {getStatusText(activeRequest.status)}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Droplets className="h-5 w-5 text-cyan-500 mr-3" />
                <span className="text-gray-700">125L Filtered Water Cane</span>
              </div>
              
              {activeRequest.transporterName && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Your Transporter</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-700">{activeRequest.transporterName}</p>
                      <p className="text-sm text-gray-600">{activeRequest.transporterPhone}</p>
                    </div>
                    <a
                      href={`tel:${activeRequest.transporterPhone}`}
                      className="bg-cyan-500 text-white p-3 rounded-full hover:bg-cyan-600 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                    </a>
                  </div>
                  {activeRequest.estimatedTime && (
                    <div className="flex items-center mt-3 text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      Estimated arrival: {activeRequest.estimatedTime} minutes
                    </div>
                  )}
                </div>
              )}
              
              {activeRequest.status === 'pending' && (
                <button
                  onClick={handleCancelRequest}
                  className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors"
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-6">
            <div className="bg-cyan-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Droplets className="h-12 w-12 text-cyan-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Need Fresh Water?</h3>
            <p className="text-gray-600 mb-8">Get premium 125L filtered water delivered to your doorstep</p>
            
            <button
              onClick={handleRequestWater}
              disabled={isRequesting}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isRequesting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                  Finding Transporter...
                </div>
              ) : (
                'Request 125L Water Cane'
              )}
            </button>
          </div>
        )}

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold">1</div>
              <span className="text-gray-700">Tap to request a water cane</span>
            </div>
            <div className="flex items-center">
              <div className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold">2</div>
              <span className="text-gray-700">Get matched with nearest transporter</span>
            </div>
            <div className="flex items-center">
              <div className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold">3</div>
              <span className="text-gray-700">Track delivery in real-time</span>
            </div>
            <div className="flex items-center">
              <div className="bg-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center mr-4 text-sm font-bold">4</div>
              <span className="text-gray-700">Fresh water delivered to your door</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Profile</h3>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <p className="text-gray-800">{currentUser.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-800">{currentUser.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-gray-600">{currentUser.location.address}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="w-full mt-6 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
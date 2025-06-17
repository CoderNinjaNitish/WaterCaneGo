import React, { useState, useEffect } from 'react';
import { Truck, CheckCircle, Clock, Phone, User, LogOut, MapPin, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useRequests } from '../contexts/RequestContext';
import { WaterRequest } from '../types';

const TransporterDashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { getNearbyRequests, acceptRequest, updateRequestStatus, requests } = useRequests();
  const [nearbyRequests, setNearbyRequests] = useState<WaterRequest[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<WaterRequest | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (currentUser && isOnline) {
      const nearby = getNearbyRequests(currentUser.location);
      setNearbyRequests(nearby);
      
      // Check for active delivery
      const myActiveDelivery = requests.find(req => 
        req.transporterId === currentUser.id && 
        (req.status === 'accepted' || req.status === 'on_the_way')
      );
      setActiveDelivery(myActiveDelivery || null);
    }
  }, [currentUser, requests, isOnline, getNearbyRequests]);

  const handleAcceptRequest = (request: WaterRequest) => {
    if (currentUser) {
      acceptRequest(request.id, currentUser);
      setActiveDelivery(request);
    }
  };

  const handleStatusUpdate = (requestId: string, status: WaterRequest['status']) => {
    updateRequestStatus(requestId, status);
    if (status === 'delivered') {
      setActiveDelivery(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'on_the_way': return 'text-purple-600 bg-purple-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">Transporter Hub</h1>
                <p className="text-sm text-gray-600">Welcome, {currentUser.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Online</span>
                <button
                  onClick={() => setIsOnline(!isOnline)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    isOnline ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                    isOnline ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
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
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-full mr-3 ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-gray-800">
                  {isOnline ? 'You are online' : 'You are offline'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isOnline ? 'Ready to accept delivery requests' : 'Go online to receive requests'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Vehicle</p>
              <p className="font-semibold text-gray-800">{currentUser.vehicleType}</p>
            </div>
          </div>
        </div>

        {/* Active Delivery */}
        {activeDelivery && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Active Delivery</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activeDelivery.status)}`}>
                {activeDelivery.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Customer Details</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">{activeDelivery.userName}</p>
                    <p className="text-sm text-gray-600">{activeDelivery.userPhone}</p>
                  </div>
                  <a
                    href={`tel:${activeDelivery.userPhone}`}
                    className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-500 mr-3 mt-1" />
                <div>
                  <p className="font-medium text-gray-800">Delivery Address</p>
                  <p className="text-gray-600">{activeDelivery.pickupLocation.address}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {activeDelivery.status === 'accepted' && (
                  <button
                    onClick={() => handleStatusUpdate(activeDelivery.id, 'on_the_way')}
                    className="flex-1 bg-purple-500 text-white py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
                  >
                    Mark as On the Way
                  </button>
                )}
                {activeDelivery.status === 'on_the_way' && (
                  <button
                    onClick={() => handleStatusUpdate(activeDelivery.id, 'delivered')}
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Available Requests */}
        {isOnline && !activeDelivery && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              Available Requests ({nearbyRequests.length})
            </h3>
            
            {nearbyRequests.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">No requests nearby</h4>
                <p className="text-gray-500">New requests will appear here automatically</p>
              </div>
            ) : (
              <div className="space-y-4">
                {nearbyRequests.map((request) => (
                  <div key={request.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="bg-cyan-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-cyan-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{request.userName}</p>
                          <p className="text-sm text-gray-600">{request.userPhone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Requested at</p>
                        <p className="font-semibold text-gray-800">{formatTime(request.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <p className="text-gray-600 text-sm">{request.pickupLocation.address}</p>
                    </div>
                    
                    <button
                      onClick={() => handleAcceptRequest(request)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                    >
                      Accept Request
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Offline State */}
        {!isOnline && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="h-12 w-12 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">You're offline</h3>
            <p className="text-gray-600 mb-6">Turn on your online status to start receiving delivery requests</p>
            <button
              onClick={() => setIsOnline(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              Go Online
            </button>
          </div>
        )}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <p className="text-gray-800">{currentUser.vehicleType}</p>
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

export default TransporterDashboard;
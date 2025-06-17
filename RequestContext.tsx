import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WaterRequest, User, RequestContextType, PaymentMethod } from '../types';
import { storage } from '../utils/storage';
import { calculateDistance } from '../utils/location';

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequests = () => {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequests must be used within a RequestProvider');
  }
  return context;
};

interface RequestProviderProps {
  children: ReactNode;
}

export const RequestProvider: React.FC<RequestProviderProps> = ({ children }) => {
  const [requests, setRequests] = useState<WaterRequest[]>([]);
  const [activeRequest, setActiveRequest] = useState<WaterRequest | null>(null);

  useEffect(() => {
    const savedRequests = storage.get('waterRequests') || [];
    setRequests(savedRequests);
    
    const savedActiveRequest = storage.get('activeRequest');
    if (savedActiveRequest) {
      setActiveRequest(savedActiveRequest);
    }
  }, []);

  useEffect(() => {
    storage.set('waterRequests', requests);
  }, [requests]);

  useEffect(() => {
    if (activeRequest) {
      storage.set('activeRequest', activeRequest);
    } else {
      storage.remove('activeRequest');
    }
  }, [activeRequest]);

  const createRequest = (requestData: Omit<WaterRequest, 'id' | 'createdAt' | 'status' | 'amount'>) => {
    const newRequest: WaterRequest = {
      ...requestData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      amount: 150, // Base price for 125L water cane
      paymentStatus: 'pending'
    };
    
    setRequests(prev => [...prev, newRequest]);
    setActiveRequest(newRequest);
  };

  const acceptRequest = (requestId: string, transporter: User) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'accepted', 
            transporterId: transporter.id,
            transporterName: transporter.name,
            transporterPhone: transporter.phone,
            acceptedAt: new Date().toISOString(),
            estimatedTime: Math.floor(Math.random() * 20) + 10 // 10-30 minutes
          }
        : req
    ));
    
    // Update active request if it's the accepted one
    if (activeRequest?.id === requestId) {
      setActiveRequest(prev => prev ? {
        ...prev,
        status: 'accepted',
        transporterId: transporter.id,
        transporterName: transporter.name,
        transporterPhone: transporter.phone,
        acceptedAt: new Date().toISOString(),
        estimatedTime: Math.floor(Math.random() * 20) + 10
      } : null);
    }
  };

  const updateRequestStatus = (requestId: string, status: WaterRequest['status']) => {
    const now = new Date().toISOString();
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status,
            ...(status === 'delivered' && { 
              deliveredAt: now,
              paymentStatus: req.paymentMethod?.type === 'cod' ? 'completed' : req.paymentStatus
            })
          }
        : req
    ));
    
    if (activeRequest?.id === requestId) {
      if (status === 'delivered') {
        setActiveRequest(null);
      } else {
        setActiveRequest(prev => prev ? {
          ...prev,
          status,
          ...(status === 'delivered' && { 
            deliveredAt: now,
            paymentStatus: prev.paymentMethod?.type === 'cod' ? 'completed' : prev.paymentStatus
          })
        } : null);
      }
    }
  };

  const cancelRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { 
        ...req, 
        status: 'cancelled',
        paymentStatus: req.paymentStatus === 'completed' ? 'refunded' : 'cancelled'
      } : req
    ));
    
    if (activeRequest?.id === requestId) {
      setActiveRequest(null);
    }
  };

  const updatePaymentMethod = (requestId: string, paymentMethod: PaymentMethod) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            paymentMethod,
            transactionId: paymentMethod.type !== 'cod' ? 'TXN' + Date.now().toString() : undefined
          }
        : req
    ));
    
    if (activeRequest?.id === requestId) {
      setActiveRequest(prev => prev ? {
        ...prev,
        paymentMethod,
        transactionId: paymentMethod.type !== 'cod' ? 'TXN' + Date.now().toString() : undefined
      } : null);
    }
  };

  const processPayment = async (requestId: string): Promise<boolean> => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, paymentStatus: 'completed' }
          : req
      ));
      
      if (activeRequest?.id === requestId) {
        setActiveRequest(prev => prev ? {
          ...prev,
          paymentStatus: 'completed'
        } : null);
      }
    } else {
      setRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, paymentStatus: 'failed' }
          : req
      ));
      
      if (activeRequest?.id === requestId) {
        setActiveRequest(prev => prev ? {
          ...prev,
          paymentStatus: 'failed'
        } : null);
      }
    }
    
    return success;
  };

  const getNearbyRequests = (transporterLocation: User['location']): WaterRequest[] => {
    return requests.filter(req => {
      if (req.status !== 'pending') return false;
      
      const distance = calculateDistance(
        transporterLocation.lat,
        transporterLocation.lng,
        req.pickupLocation.lat,
        req.pickupLocation.lng
      );
      
      return distance <= 5; // Within 5km
    });
  };

  const value: RequestContextType = {
    requests,
    activeRequest,
    createRequest,
    acceptRequest,
    updateRequestStatus,
    cancelRequest,
    getNearbyRequests,
    updatePaymentMethod,
    processPayment
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
};
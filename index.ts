export interface User {
  id: string;
  name: string;
  phone: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  role: 'user' | 'transporter';
  vehicleType?: string;
  isOnline?: boolean;
}

export interface WaterRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'pending' | 'accepted' | 'on_the_way' | 'delivered' | 'cancelled';
  transporterId?: string;
  transporterName?: string;
  transporterPhone?: string;
  estimatedTime?: number;
  createdAt: string;
  acceptedAt?: string;
  deliveredAt?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  transactionId?: string;
}

export interface PaymentMethod {
  type: 'upi' | 'card' | 'wallet' | 'cod';
  provider?: 'gpay' | 'phonepe' | 'paytm' | 'amazonpay' | 'visa' | 'mastercard' | 'rupay';
  details?: string; // UPI ID, last 4 digits of card, etc.
}

export interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateLocation: (location: User['location']) => void;
}

export interface RequestContextType {
  requests: WaterRequest[];
  activeRequest: WaterRequest | null;
  createRequest: (request: Omit<WaterRequest, 'id' | 'createdAt' | 'status' | 'amount'>) => void;
  acceptRequest: (requestId: string, transporter: User) => void;
  updateRequestStatus: (requestId: string, status: WaterRequest['status']) => void;
  cancelRequest: (requestId: string) => void;
  getNearbyRequests: (transporterLocation: User['location']) => WaterRequest[];
  updatePaymentMethod: (requestId: string, paymentMethod: PaymentMethod) => void;
  processPayment: (requestId: string) => Promise<boolean>;
}
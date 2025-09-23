export interface User {
  id: string;
  username: string;
  email: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
    bio?: string;
    dateOfBirth: Date;
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  createdAt: Date;
  lastLoginAt: Date;
  isActive: boolean;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_account';
  lastFourDigits?: string;
  expiryMonth?: number;
  expiryYear?: number;
  provider?: string;
  isDefault: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  tags: string[];
  images: string[];
  inStock: boolean;
  stockCount: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
  selectedOptions?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  appliedDiscount?: number;
  updatedAt: Date;
}

export interface UserCartState {
  user: User | null;
  cart: Cart;
  wishlist: Product[];
}
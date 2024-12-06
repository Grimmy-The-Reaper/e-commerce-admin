import { Timestamp } from "firebase/firestore";

export interface Store{
    id: string;
    name: string;
    userId: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    
}

export interface Billboards {
    id: string;
    label: string;
    imageUrl: string;
    updatedAt?: string;
    createdAt?: Timestamp;
  }

  export interface Author {
    id: string;
    billboardId: string;
    billboardLabel: string;
    name: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  }

  export interface Genre {
    id: string;
    name: string;
    value: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  }

  export interface Book {
    id: string;
    name: string;
    price: number;
    qty?: number;
    images: { url: string }[];
    isFeatured: boolean;
    isArchived: boolean;
    author: string;
    genre: string
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  }
  
  export interface Order {
    id: string;
    isPaid: boolean;
    phone: string;
    orderItems: Book[];
    address: string;
    order_status: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
  }
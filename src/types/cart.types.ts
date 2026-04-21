// Product ডিটেইলস (পপুলেট হওয়ার পর যা আসবে)
export interface IProduct {
  _id: string;
  title: string;
  images: string[];
  price: number;
  stock: number;
  brand: string;
}

// প্রতিটি কার্ট আইটেমের টাইপ
export interface ICartItem {
  _id: string; // সাব-ডকুমেন্টের নিজস্ব আইডি
  productId: IProduct; // যেহেতু পপুলেট করা হয়েছে, এখানে অবজেক্ট আসবে
  quantity: number;
  price: number; // আইটেমটি যোগ করার সময়কার দাম
}

// পুরো কার্টের টাইপ
export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  totalAmount: number;
  createdAt?: string;
  updatedAt?: string;
}
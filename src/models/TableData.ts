interface ProductDetails {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercent: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
}

interface UserDetails {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
}

export type {
  ProductDetails,
  UserDetails
}

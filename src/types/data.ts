import { Timestamp } from "firebase/firestore";

export type PublicationStatus = "published" | "draft";

export interface ServiceItem {
  id?: string;
  slug: string;
  title: string;
  description: string;
  specs: string[];
  category: string;
  imageUrl: string;
  imagePublicId?: string;
  orderIndex: number;
  status: PublicationStatus;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
  updatedBy?: string;
}

export type GalleryCategory = "Passenger Lifts" | "Goods Lifts" | "Hospital Lifts" | "MRL Lifts" | "Installation" | "Cabins" | "Doors" | "Components";

export interface GalleryItem {
  id?: string;
  title: string;
  category: GalleryCategory;
  imageUrl: string;
  imagePublicId?: string;
  altText?: string;
  orderIndex: number;
  status: PublicationStatus;
  createdAt?: Timestamp | string;
  updatedAt?: Timestamp | string;
  updatedBy?: string;
}

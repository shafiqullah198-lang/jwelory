import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiFetch } from "../api";
import { Hero } from "../components/Hero";
import {
  FeaturedCategories,
  BestSellers,
  NewArrivals,
  LuxurySaleCollection,
  OfferBanner,
  WhyChooseUs,
  Testimonials,
  InstagramGallery,
  Newsletter,
} from "../components/Sections";
import { ProductGrid } from "../components/ProductGrid";
import type { Product } from "../components/ProductCard";

interface HomeProps {
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export default function Home({ onAddToCart, onQuickView }: HomeProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomepage() {
      try {
        const res = await apiFetch("homepage/");
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to load homepage dynamic data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomepage();
  }, []);

  // Map backend products to frontend Product structures
  const mapProducts = useCallback((list: any[]): Product[] => {
    if (!list) return [];
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      price: p.currentPrice,
      originalPrice: p.price,
      rating: p.rating,
      reviewCount: p.reviewCount,
      image: p.image,
      isNew: p.isNew,
      isTrending: p.isTrending,
      inStock: p.inStock,
    }));
  }, []);

  const bestSellers = useMemo(() => (data ? mapProducts(data.best_sellers) : []), [data, mapProducts]);
  const newArrivals = useMemo(() => (data ? mapProducts(data.new_arrivals) : []), [data, mapProducts]);

  return (
    <main>
      {/* 1. Hero banner section */}
      <Hero bannerData={data?.hero} />

      {/* 2. Featured categories section */}
      <FeaturedCategories categoriesData={data?.categories} />

      {/* 3. Bestsellers section */}
      <BestSellers
        products={bestSellers}
        loading={loading}
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
      />

      {/* 4. New arrivals section */}
      <NewArrivals
        products={newArrivals}
        loading={loading}
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
      />

      {/* 4.5. Luxury Sale Collection */}
      <LuxurySaleCollection
        onAddToCart={onAddToCart}
        onQuickView={onQuickView}
      />

      {/* 5. Offer banner */}
      <OfferBanner offerData={data?.settings?.offer} />

      {/* 6. Static / promise section */}
      <WhyChooseUs />

      {/* 7. Testimonials section */}
      <Testimonials testimonialsData={data?.testimonials} />

      {/* 8. Instagram social grid */}
      <InstagramGallery handle={data?.settings?.instagram_handle} />

      {/* 9. Circular newsletter sign up */}
      <Newsletter />
    </main>
  );
}

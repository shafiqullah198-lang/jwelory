import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "../components/AuthContext";
import { apiFetch } from "../api";
import { BRAND_NAME, BrandLogo } from "../components/BrandLogo";
import {
  LayoutDashboard,
  Package,
  FolderHeart,
  ShoppingBag,
  Users,
  MessageSquare,
  Image as ImageIcon,
  FileText,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  Check,
  EyeOff,
  ArrowLeft,
  Upload,
  Loader2,
  Mail,
  CheckCircle,
  Eye,
  ShieldCheck,
  DollarSign
} from "lucide-react";

export default function AdminDashboard() {
  const { user, loading, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getTabFromPath = (path: string) => {
    if (path === "/dashboard") return "overview";
    if (path.endsWith("/admin/products")) return "products";
    if (path.endsWith("/admin/categories")) return "categories";
    if (path.endsWith("/admin/orders")) return "orders";
    if (path.endsWith("/admin/customers")) return "customers";
    if (path.endsWith("/admin/reviews")) return "reviews";
    if (path.endsWith("/admin/hero-banners")) return "hero";
    if (path.endsWith("/admin/cms")) return "cms";
    if (path.endsWith("/admin/settings")) return "settings";
    return "overview";
  };

  // Navigation & Layout states
  const [activeTab, setActiveTab] = useState(() => getTabFromPath(window.location.pathname));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setActiveTab(getTabFromPath(location.pathname));
  }, [location.pathname]);

  // Data states
  const [overviewData, setOverviewData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [heroCMS, setHeroCMS] = useState<any>(null);
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  // Selected details / Modals states
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Product Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [prodName, setProdName] = useState("");
  const [prodCategory, setProdCategory] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodSalePrice, setProdSalePrice] = useState("");
  const [prodStock, setProdStock] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodNewArrival, setProdNewArrival] = useState(false);
  const [prodTrending, setProdTrending] = useState(false);
  const [prodActive, setProdActive] = useState(true);
  const [prodImage, setProdImage] = useState<File | null>(null);

  // Category Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catDisplayOrder, setCatDisplayOrder] = useState("");
  const [catActive, setCatActive] = useState(true);
  const [catImage, setCatImage] = useState<File | null>(null);

  // Verification & Access Enforcer
  useEffect(() => {
    async function checkAuth() {
      await refreshUser();
    }
    checkAuth();
  }, []);

  useEffect(() => {
    // Redirect if definitely not staff/superuser
    if (!loading) {
      if (!user || !user.is_staff) {
        navigate("/admin/login");
      }
    }
  }, [user, loading, navigate]);

  // Fetch data on activeTab change
  useEffect(() => {
    if (!loading && user && user.is_staff) {
      setErrorMsg("");
      setSuccessMsg("");
      if (activeTab === "overview") fetchOverview();
      else if (activeTab === "products") {
        fetchProducts();
        fetchCategories(); // for dropdowns
      } else if (activeTab === "categories") fetchCategories();
      else if (activeTab === "orders") fetchOrders();
      else if (activeTab === "customers") fetchCustomers();
      else if (activeTab === "reviews") fetchReviews();
      else if (activeTab === "hero") fetchHero();
      else if (activeTab === "cms") fetchCmsContent();
      else if (activeTab === "settings") fetchSettings();
    }
  }, [activeTab, user, loading]);

  // Flash messages helper
  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };
  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 4000);
  };

  // ── API Fetchers ──

  const fetchOverview = async () => {
    try {
      const data = await apiFetch("dashboard/");
      if (data && data.success) {
        setOverviewData(data);
      }
    } catch (err: any) {
      showError(err.message || "Failed to load dashboard overview.");
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await apiFetch("products/?all=true");
      if (data && data.products) {
        setProducts(data.products);
      }
    } catch (err: any) {
      showError(err.message || "Failed to load products list.");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiFetch("dashboard/categories/");
      if (data && data.success) {
        setCategories(data.categories);
      }
    } catch (err: any) {
      showError(err.message || "Failed to load categories.");
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await apiFetch("dashboard/orders/");
      if (data && data.success) {
        setOrders(data.orders);
      }
    } catch (err: any) {
      showError(err.message || "Failed to load orders.");
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await apiFetch("dashboard/users/");
      if (data && data.success) {
        setCustomers(data.customers);
      }
    } catch (err: any) {
      showError(err.message || "Failed to load customers.");
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await apiFetch("dashboard/reviews/");
      if (data && data.success) {
        setReviews(data.reviews);
      }
    } catch (err: any) {
      showError(err.message || "Failed to load reviews.");
    }
  };

  const fetchHero = async () => {
    try {
      const data = await apiFetch("dashboard/cms/hero/");
      if (data && data.success) {
        setHeroCMS(data.hero);
      }
    } catch (err: any) {
      showError(err.message || "Failed to load hero banner configuration.");
    }
  };

  const fetchCmsContent = async () => {
    try {
      const data = await apiFetch("dashboard/cms/content/");
      if (data && data.success) {
        setCmsContent(data);
      }
    } catch (err: any) {
      showError(err.message || "Failed to load website content details.");
    }
  };

  const fetchSettings = async () => {
    try {
      const data = await apiFetch("dashboard/cms/settings/");
      if (data && data.success) {
        setSiteSettings(data.settings);
      }
    } catch (err: any) {
      showError(err.message || "Failed to load site configurations.");
    }
  };

  // ── Actions ──

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out from control panel?")) {
      try {
        await logout();
        navigate("/admin/login");
      } catch (err) {
        console.error("Logout error", err);
      }
    }
  };

  // Order Status update
  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    setActionLoading(true);
    try {
      const data = await apiFetch(`dashboard/orders/${orderId}/status/`, {
        method: "POST",
        body: JSON.stringify({ status }),
      });
      if (data && data.success) {
        showSuccess(data.message);
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(data.order);
        }
        fetchOrders();
      }
    } catch (err: any) {
      showError(err.message || "Failed to update order status.");
    } finally {
      setActionLoading(false);
    }
  };

  // Review Actions
  const handleToggleReviewActive = async (reviewId: number, currentActive: boolean) => {
    const endpoint = currentActive ? "hide" : "approve";
    try {
      const data = await apiFetch(`dashboard/reviews/${reviewId}/${endpoint}/`, {
        method: "POST",
      });
      if (data && data.success) {
        showSuccess(data.message);
        fetchReviews();
      }
    } catch (err: any) {
      showError(err.message || "Failed to modify review status.");
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (window.confirm("Delete this review permanently?")) {
      try {
        const data = await apiFetch(`dashboard/reviews/${reviewId}/delete/`, {
          method: "POST",
        });
        if (data && data.success) {
          showSuccess(data.message);
          fetchReviews();
        }
      } catch (err: any) {
        showError(err.message || "Failed to delete review.");
      }
    }
  };

  // CMS Content Subscribers deletion
  const handleDeleteSubscriber = async (subId: number) => {
    if (window.confirm("Remove this email subscriber?")) {
      try {
        const data = await apiFetch(`dashboard/cms/subscribers/${subId}/delete/`, {
          method: "POST",
        });
        if (data && data.success) {
          showSuccess(data.message);
          fetchCmsContent();
        }
      } catch (err: any) {
        showError(err.message || "Failed to remove subscriber.");
      }
    }
  };

  // CMS Messages read marking
  const handleMarkMessageRead = async (msgId: number) => {
    try {
      const data = await apiFetch(`dashboard/messages/${msgId}/read/`, {
        method: "POST",
      });
      if (data && data.success) {
        showSuccess(data.message);
        fetchCmsContent();
      }
    } catch (err: any) {
      showError(err.message || "Failed to mark message read.");
    }
  };

  // Products CRUD
  const handleOpenProductForm = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setProdName(product.name);
      setProdCategory(product.category_id || product.category || "");
      setProdPrice(product.price || product.originalPrice || "");
      setProdSalePrice(product.sale_price || product.salePrice || "");
      setProdStock(product.stock || "");
      setProdDesc(product.description || "");
      setProdFeatured(product.isFeatured || product.is_featured || false);
      setProdNewArrival(product.isNew || product.is_new_arrival || false);
      setProdTrending(product.isTrending || product.is_trending || false);
      setProdActive(product.is_active !== undefined ? product.is_active : true);
    } else {
      setEditingProduct(null);
      setProdName("");
      setProdCategory(categories[0]?.id || "");
      setProdPrice("");
      setProdSalePrice("");
      setProdStock("");
      setProdDesc("");
      setProdFeatured(false);
      setProdNewArrival(false);
      setProdTrending(false);
      setProdActive(true);
    }
    setProdImage(null);
    setShowProductForm(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", prodName);
      formData.append("category", prodCategory);
      formData.append("price", prodPrice);
      formData.append("sale_price", prodSalePrice || "");
      formData.append("stock", prodStock);
      formData.append("description", prodDesc);
      formData.append("is_featured", prodFeatured ? "on" : "off");
      formData.append("is_new_arrival", prodNewArrival ? "on" : "off");
      formData.append("is_trending", prodTrending ? "on" : "off");
      formData.append("is_active", prodActive ? "on" : "off");
      if (prodImage) {
        formData.append("image", prodImage);
      }

      let endpoint = "products/";
      let method = "POST";
      if (editingProduct) {
        endpoint = `products/${editingProduct.id}/`;
        method = "PATCH";
      }

      const data = await apiFetch(endpoint, {
        method: method,
        body: formData, // FormData triggers multipart upload
      });

      if (data && data.success) {
        showSuccess(data.message);
        setShowProductForm(false);
        fetchProducts();
      }
    } catch (err: any) {
      showError(err.message || "Failed to save product.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setActionLoading(true);
      try {
        const data = await apiFetch(`products/${productId}/`, {
          method: "DELETE",
        });
        if (data && data.success) {
          showSuccess(data.message);
          fetchProducts();
        }
      } catch (err: any) {
        showError(err.message || "Failed to delete product.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Categories CRUD
  const handleOpenCategoryForm = (category: any = null) => {
    if (category) {
      setEditingCategory(category);
      setCatName(category.name);
      setCatDesc(category.description || "");
      setCatDisplayOrder(category.display_order);
      setCatActive(category.is_active);
    } else {
      setEditingCategory(null);
      setCatName("");
      setCatDesc("");
      setCatDisplayOrder("0");
      setCatActive(true);
    }
    setCatImage(null);
    setShowCategoryForm(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", catName);
      formData.append("description", catDesc);
      formData.append("display_order", catDisplayOrder);
      formData.append("is_active", catActive ? "on" : "off");
      if (catImage) {
        formData.append("image", catImage);
      }

      let endpoint = "dashboard/categories/create/";
      if (editingCategory) {
        endpoint = `dashboard/categories/${editingCategory.id}/edit/`;
      }

      const data = await apiFetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (data && data.success) {
        showSuccess(data.message);
        setShowCategoryForm(false);
        fetchCategories();
      }
    } catch (err: any) {
      showError(err.message || "Failed to save category.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category? All its products will be deleted!")) {
      setActionLoading(true);
      try {
        const data = await apiFetch(`dashboard/categories/${categoryId}/delete/`, {
          method: "POST",
        });
        if (data && data.success) {
          showSuccess(data.message);
          fetchCategories();
        }
      } catch (err: any) {
        showError(err.message || "Failed to delete category.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Save Hero Banner CMS Form
  const handleSaveHeroCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);

      const data = await apiFetch("dashboard/cms/hero/", {
        method: "POST",
        body: formData,
      });

      if (data && data.success) {
        showSuccess(data.message);
        fetchHero();
      }
    } catch (err: any) {
      showError(err.message || "Failed to update Hero section.");
    } finally {
      setActionLoading(false);
    }
  };

  // Save Settings Form
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const data = await apiFetch("dashboard/cms/settings/", {
        method: "POST",
        body: JSON.stringify(siteSettings),
      });

      if (data && data.success) {
        showSuccess(data.message);
        fetchSettings();
      }
    } catch (err: any) {
      showError(err.message || "Failed to update configurations.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── Render Views ──

  const renderOverview = () => {
    if (!overviewData) return <div className="text-center py-10 text-gray-500">Loading overview stats...</div>;
    const { stats, recent_orders, low_stock_items } = overviewData;

    return (
      <div className="space-y-8 animate-fadeIn">
        {/* Dynamic Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Products</p>
              <h3 className="text-xl md:text-2xl font-semibold mt-2 text-white font-serif">{stats.total_products}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-[#C9A84C]/5 border border-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
              <Package size={20} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Categories</p>
              <h3 className="text-xl md:text-2xl font-semibold mt-2 text-white font-serif">{stats.total_categories}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <FolderHeart size={20} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Orders</p>
              <h3 className="text-xl md:text-2xl font-semibold mt-2 text-white font-serif">{stats.total_orders}</h3>
              <div className="flex gap-2 mt-1">
                <span className="text-[8px] text-amber-500 font-bold uppercase">{stats.pending_orders} Pending</span>
                <span className="text-[8px] text-emerald-500 font-bold uppercase">{stats.delivered_orders} Delivered</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShoppingBag size={20} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Total Revenue</p>
              <h3 className="text-xl md:text-2xl font-semibold mt-2 text-white font-serif">{formatCurrency(stats.total_revenue)}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center text-[#C9A84C]">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Registered Customers</p>
              <h3 className="text-xl md:text-2xl font-semibold mt-2 text-white font-serif">{stats.total_customers}</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-pink-500/5 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Users size={20} />
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 flex items-center justify-between col-span-1">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Low Stock Warning</p>
              <h3 className="text-xl md:text-2xl font-semibold mt-2 text-rose-500 font-serif">{stats.low_stock_products} items</h3>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldCheck size={20} />
            </div>
          </div>
        </div>

        {/* Split Grid: Recent Orders and Stock Alert */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 space-y-4">
            <h3 className="text-lg font-semibold text-white font-serif">Recent Customer Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-400">
                <thead>
                  <tr className="border-b border-[#C9A84C]/10 text-gray-500 uppercase">
                    <th className="py-3 px-2 font-bold">Order ID</th>
                    <th className="py-3 px-2 font-bold">Customer</th>
                    <th className="py-3 px-2 font-bold">Amount</th>
                    <th className="py-3 px-2 font-bold">Status</th>
                    <th className="py-3 px-2 text-right font-bold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {recent_orders.map((order: any) => (
                    <tr key={order.id} className="border-b border-[#C9A84C]/5 hover:bg-white/2 transition-colors">
                      <td className="py-3 px-2 font-mono text-white">#{order.order_number}</td>
                      <td className="py-3 px-2 font-medium text-white">{order.full_name}</td>
                      <td className="py-3 px-2 text-white">{formatCurrency(order.total)}</td>
                      <td className="py-3 px-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                          style={{
                            backgroundColor: `${order.status_color}15`,
                            color: order.status_color,
                            border: `1px solid ${order.status_color}30`,
                          }}
                        >
                          {order.status_display}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowOrderModal(true);
                          }}
                          className="text-[#C9A84C] hover:underline font-semibold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 space-y-4">
            <h3 className="text-lg font-semibold text-white font-serif">Low Inventory Alerts</h3>
            {low_stock_items.length === 0 ? (
              <div className="text-center py-10 text-emerald-400 text-xs font-semibold">
                ✓ All products are well-stocked.
              </div>
            ) : (
              <div className="space-y-3">
                {low_stock_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-3 rounded-2xl bg-black/40 border border-[#C9A84C]/10 text-xs">
                    <div>
                      <p className="font-bold text-white truncate max-w-[150px]">{item.name}</p>
                      <p className="text-rose-400 font-semibold mt-0.5">Remaining Stock: {item.stock}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("products");
                        handleOpenProductForm(item);
                      }}
                      className="px-3 py-1 text-[9px] bg-gradient-to-r from-[#E0C87A] to-[#C9A84C] text-black font-bold uppercase rounded-full"
                    >
                      Restock
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProducts = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white font-serif">Catalog Management</h2>
            <p className="text-xs text-gray-500 mt-1">Manage stock inventory, catalog prices, images, and special badges.</p>
          </div>
          <button
            onClick={() => handleOpenProductForm()}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E0C87A] to-[#C9A84C] text-black font-bold text-xs uppercase rounded-full hover:shadow-lg transition-all"
          >
            <Plus size={14} /> Add Product
          </button>
        </div>

        {/* Products List Table */}
        <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead>
                <tr className="border-b border-[#C9A84C]/10 text-gray-500 uppercase">
                  <th className="py-3 px-2 font-bold">Image</th>
                  <th className="py-3 px-2 font-bold">Name</th>
                  <th className="py-3 px-2 font-bold">Category</th>
                  <th className="py-3 px-2 font-bold">Price</th>
                  <th className="py-3 px-2 font-bold">Stock</th>
                  <th className="py-3 px-2 font-bold">Badges</th>
                  <th className="py-3 px-2 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500 font-medium">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p.id} className="border-b border-[#C9A84C]/5 hover:bg-white/2 transition-colors">
                      <td className="py-3 px-2">
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-lg border border-[#C9A84C]/10" />
                        ) : (
                          <div className="w-10 h-12 rounded-lg bg-black/40 border border-[#C9A84C]/10 flex items-center justify-center text-[9px]">No Img</div>
                        )}
                      </td>
                      <td className="py-3 px-2 font-semibold text-white">{p.name}</td>
                      <td className="py-3 px-2">{p.category_name}</td>
                      <td className="py-3 px-2 text-white">
                        {p.sale_price ? (
                          <div className="flex flex-col">
                            <span className="text-emerald-400 font-bold">{formatCurrency(p.sale_price || p.salePrice)}</span>
                            <span className="line-through text-gray-500 text-[10px]">{formatCurrency(p.price || p.originalPrice)}</span>
                          </div>
                        ) : (
                          <span>{formatCurrency(p.price || p.originalPrice)}</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`font-bold ${p.stock <= 5 ? "text-rose-500" : "text-gray-300"}`}>{p.stock}</span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex flex-wrap gap-1">
                          {p.is_featured && <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 text-[8px] font-bold uppercase">Featured</span>}
                          {p.is_new_arrival && <span className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 text-[8px] font-bold uppercase">New</span>}
                          {p.is_trending && <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 text-[8px] font-bold uppercase">Hot</span>}
                          {!p.is_active && <span className="px-1.5 py-0.5 rounded bg-gray-500/10 text-gray-400 text-[8px] font-bold uppercase">Hidden</span>}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => handleOpenProductForm(p)} className="text-[#C9A84C] hover:text-[#E0C87A]">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id)} className="text-rose-500 hover:text-rose-400">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Modal Form Overlay */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0F0D04] border border-[#C9A84C]/25 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-scaleIn">
              <div className="flex justify-between items-center border-b border-[#C9A84C]/10 pb-4">
                <h3 className="text-xl font-semibold text-white font-serif">{editingProduct ? "Edit Product" : "Add New Product"}</h3>
                <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Product Name</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full bg-black border border-[#C9A84C]/20 rounded-full px-4 py-2.5 text-xs text-white outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value)}
                      className="w-full bg-black border border-[#C9A84C]/20 rounded-full px-4 py-2.5 text-xs text-white outline-none focus:border-[#C9A84C]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Price (Rs.)</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full bg-black border border-[#C9A84C]/20 rounded-full px-4 py-2.5 text-xs text-white outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Sale Price (Rs.) (Optional)</label>
                    <input
                      type="number"
                      value={prodSalePrice}
                      onChange={(e) => setProdSalePrice(e.target.value)}
                      className="w-full bg-black border border-[#C9A84C]/20 rounded-full px-4 py-2.5 text-xs text-white outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(e.target.value)}
                      className="w-full bg-black border border-[#C9A84C]/20 rounded-full px-4 py-2.5 text-xs text-white outline-none focus:border-[#C9A84C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Description</label>
                  <textarea
                    rows={3}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full bg-black border border-[#C9A84C]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#C9A84C] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Upload Product Image</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProdImage(e.target.files?.[0] || null)}
                      className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                    />
                  </div>
                </div>

                {/* Badges / Visibility checks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-black/40 border border-[#C9A84C]/10 rounded-2xl">
                  <label className="flex items-center gap-2 text-[10px] uppercase text-gray-300 font-bold cursor-pointer select-none">
                    <input type="checkbox" checked={prodFeatured} onChange={(e) => setProdFeatured(e.target.checked)} className="rounded text-[#C9A84C]" />
                    Featured
                  </label>
                  <label className="flex items-center gap-2 text-[10px] uppercase text-gray-300 font-bold cursor-pointer select-none">
                    <input type="checkbox" checked={prodNewArrival} onChange={(e) => setProdNewArrival(e.target.checked)} className="rounded text-[#C9A84C]" />
                    New Arrival
                  </label>
                  <label className="flex items-center gap-2 text-[10px] uppercase text-gray-300 font-bold cursor-pointer select-none">
                    <input type="checkbox" checked={prodTrending} onChange={(e) => setProdTrending(e.target.checked)} className="rounded text-[#C9A84C]" />
                    Bestseller / Hot
                  </label>
                  <label className="flex items-center gap-2 text-[10px] uppercase text-gray-300 font-bold cursor-pointer select-none">
                    <input type="checkbox" checked={prodActive} onChange={(e) => setProdActive(e.target.checked)} className="rounded text-[#C9A84C]" />
                    Is Visible / Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#C9A84C]/10">
                  <button
                    type="button"
                    onClick={() => setShowProductForm(false)}
                    className="px-5 py-2.5 rounded-full text-[10px] uppercase tracking-wider font-bold border border-[#C9A84C]/25 text-[#C9A84C] hover:bg-[#C9A84C]/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-gradient-to-r from-[#E0C87A] to-[#C9A84C] text-black"
                  >
                    {actionLoading && <Loader2 size={12} className="animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCategories = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white font-serif">Category Directory</h2>
            <p className="text-xs text-gray-500 mt-1">Configure structural design classifications and uploads.</p>
          </div>
          <button
            onClick={() => handleOpenCategoryForm()}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#E0C87A] to-[#C9A84C] text-black font-bold text-xs uppercase rounded-full hover:shadow-lg transition-all"
          >
            <Plus size={14} /> Add Category
          </button>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border border-[#C9A84C]/15 rounded-3xl bg-[#0F0D04] font-medium">
            No categories found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c) => (
              <div key={c.id} className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="text-lg font-semibold text-white font-serif">{c.name}</h4>
                    <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-black/40 border border-[#C9A84C]/10 text-[#C9A84C]">Order: {c.display_order}</span>
                  </div>
                  {c.image ? (
                    <img src={c.image} alt={c.name} className="w-full h-32 object-cover rounded-2xl border border-[#C9A84C]/10" />
                  ) : (
                    <div className="w-full h-32 bg-black/45 rounded-2xl border border-[#C9A84C]/10 flex items-center justify-center text-xs text-gray-600">No Image Uploaded</div>
                  )}
                  <p className="text-xs text-gray-400 line-clamp-2">{c.description || "No description provided."}</p>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 pt-2 border-t border-[#C9A84C]/5">
                    <span>Total Products: <strong className="text-white font-bold">{c.product_count}</strong></span>
                    <span className={`font-semibold ${c.is_active ? "text-emerald-400" : "text-rose-400"}`}>{c.is_active ? "Active" : "Inactive"}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-3 justify-end border-t border-[#C9A84C]/5">
                  <button
                    onClick={() => handleOpenCategoryForm(c)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#C9A84C]/25 text-[#C9A84C] hover:bg-[#C9A84C]/5 text-[9px] uppercase tracking-wider font-bold"
                  >
                    <Edit2 size={10} /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-rose-500/25 text-rose-500 hover:bg-rose-500/5 text-[9px] uppercase tracking-wider font-bold"
                  >
                    <Trash2 size={10} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Category Modal Form Overlay */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0F0D04] border border-[#C9A84C]/25 rounded-3xl p-8 max-w-md w-full space-y-6 animate-scaleIn">
              <div className="flex justify-between items-center border-b border-[#C9A84C]/10 pb-4">
                <h3 className="text-xl font-semibold text-white font-serif">{editingCategory ? "Edit Category" : "Add Category"}</h3>
                <button onClick={() => setShowCategoryForm(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Category Name</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full bg-black border border-[#C9A84C]/20 rounded-full px-4 py-2.5 text-xs text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Display Order</label>
                  <input
                    type="number"
                    required
                    value={catDisplayOrder}
                    onChange={(e) => setCatDisplayOrder(e.target.value)}
                    className="w-full bg-black border border-[#C9A84C]/20 rounded-full px-4 py-2.5 text-xs text-white outline-none focus:border-[#C9A84C]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Description</label>
                  <textarea
                    rows={2}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    className="w-full bg-black border border-[#C9A84C]/20 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#C9A84C] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Category Banner Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCatImage(e.target.files?.[0] || null)}
                    className="text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] uppercase text-gray-300 font-bold cursor-pointer select-none">
                    <input type="checkbox" checked={catActive} onChange={(e) => setCatActive(e.target.checked)} className="rounded text-[#C9A84C]" />
                    Is Visible / Active
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-[#C9A84C]/10">
                  <button
                    type="button"
                    onClick={() => setShowCategoryForm(false)}
                    className="px-5 py-2.5 rounded-full text-[10px] uppercase tracking-wider font-bold border border-[#C9A84C]/25 text-[#C9A84C] hover:bg-[#C9A84C]/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] uppercase tracking-wider font-bold bg-gradient-to-r from-[#E0C87A] to-[#C9A84C] text-black"
                  >
                    {actionLoading && <Loader2 size={12} className="animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderOrders = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h2 className="text-2xl font-semibold text-white font-serif">Checkout Orders</h2>
          <p className="text-xs text-gray-500 mt-1">Verify details, trace customer logs, and modify shipping status choices.</p>
        </div>

        {/* Orders Table */}
        <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-400">
              <thead>
                <tr className="border-b border-[#C9A84C]/10 text-gray-500 uppercase">
                  <th className="py-3 px-2 font-bold">Order Number</th>
                  <th className="py-3 px-2 font-bold">Recipient</th>
                  <th className="py-3 px-2 font-bold">Subtotal</th>
                  <th className="py-3 px-2 font-bold">Shipping</th>
                  <th className="py-3 px-2 font-bold">Total Bill</th>
                  <th className="py-3 px-2 font-bold">Date Placed</th>
                  <th className="py-3 px-2 font-bold">Status</th>
                  <th className="py-3 px-2 text-right font-bold">Manage</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500 font-medium">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id} className="border-b border-[#C9A84C]/5 hover:bg-white/2 transition-colors">
                      <td className="py-3.5 px-2 font-mono text-white font-bold">#{o.order_number}</td>
                      <td className="py-3.5 px-2 text-white">
                        <div>
                          <p className="font-semibold">{o.full_name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{o.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-2">{formatCurrency(o.subtotal)}</td>
                      <td className="py-3.5 px-2">{o.shipping === 0 ? "FREE" : formatCurrency(o.shipping)}</td>
                      <td className="py-3.5 px-2 text-white font-semibold">{formatCurrency(o.total)}</td>
                      <td className="py-3.5 px-2">{new Date(o.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</td>
                      <td className="py-3.5 px-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[9px] font-bold"
                          style={{
                            backgroundColor: `${o.status_color}15`,
                            color: o.status_color,
                            border: `1px solid ${o.status_color}30`,
                          }}
                        >
                          {o.status_display}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-right">
                        <button
                          onClick={async () => {
                            try {
                              const res = await apiFetch(`dashboard/orders/${o.id}/`);
                              if (res && res.success) {
                                setSelectedOrder(res.order);
                                setShowOrderModal(true);
                              }
                            } catch (err: any) {
                              showError(err.message || "Failed to fetch order details.");
                            }
                          }}
                          className="text-[#C9A84C] hover:underline font-semibold"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal Overlay */}
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#0F0D04] border border-[#C9A84C]/25 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-scaleIn">
              <div className="flex justify-between items-center border-b border-[#C9A84C]/10 pb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white font-serif">Order Details</h3>
                  <p className="text-[10px] font-mono text-[#C9A84C] mt-1">Invoice Reference: #{selectedOrder.order_number}</p>
                </div>
                <button onClick={() => setShowOrderModal(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-300">
                {/* Info blocks */}
                <div className="md:col-span-2 space-y-6">
                  {/* Items list */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#C9A84C]/10 space-y-3">
                    <p className="font-bold uppercase tracking-wider text-gray-500 text-[9px] border-b border-[#C9A84C]/10 pb-1.5">Purchased items</p>
                    {selectedOrder.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center gap-2 border-b border-[#C9A84C]/5 pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-3">
                          {item.product_image ? (
                            <img src={item.product_image} alt={item.product_name} className="w-8 h-10 object-cover rounded border border-[#C9A84C]/10" />
                          ) : (
                            <div className="w-8 h-10 bg-white/5 border border-white/10 rounded flex items-center justify-center text-[8px]">No Img</div>
                          )}
                          <div>
                            <p className="font-bold text-white leading-tight">{item.product_name}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5">{formatCurrency(item.price)} &times; {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-semibold text-white">{formatCurrency(item.line_total)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#C9A84C]/10 space-y-2">
                    <p className="font-bold uppercase tracking-wider text-gray-500 text-[9px] border-b border-[#C9A84C]/10 pb-1.5">Pricing breakdown</p>
                    <div className="flex justify-between"><span>Subtotal:</span><span className="text-white">{formatCurrency(selectedOrder.subtotal)}</span></div>
                    <div className="flex justify-between"><span>Shipping:</span><span className="text-white">{formatCurrency(selectedOrder.shipping)}</span></div>
                    <div className="flex justify-between font-bold border-t border-[#C9A84C]/5 pt-2 text-white"><span>Order Total:</span><span className="text-[#C9A84C]">{formatCurrency(selectedOrder.total)}</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Status Dropdown */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#C9A84C]/15 space-y-3">
                    <label className="block text-[9px] uppercase tracking-wider text-gray-500 font-bold">Update Status</label>
                    <select
                      value={selectedOrder.status}
                      disabled={actionLoading}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                      className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Customer Information */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#C9A84C]/10 space-y-3">
                    <p className="font-bold uppercase tracking-wider text-gray-500 text-[9px] border-b border-[#C9A84C]/10 pb-1.5">Recipient Details</p>
                    <div><p className="text-[10px] text-gray-500">Name</p><p className="text-white font-medium mt-0.5">{selectedOrder.full_name}</p></div>
                    <div><p className="text-[10px] text-gray-500">Contact</p><p className="text-white mt-0.5">{selectedOrder.email}</p><p className="text-white">{selectedOrder.phone}</p></div>
                    <div><p className="text-[10px] text-gray-500">Shipping Address</p><p className="text-white mt-0.5 leading-relaxed">{selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p></div>
                    {selectedOrder.notes && <div><p className="text-[10px] text-gray-500">Notes</p><p className="text-amber-500 italic font-light mt-0.5">"{selectedOrder.notes}"</p></div>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCustomers = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h2 className="text-2xl font-semibold text-white font-serif">Customer Directory</h2>
          <p className="text-xs text-gray-500 mt-1">Review profiles for registered store accounts (excluding administrators/staff).</p>
        </div>

        {/* Customers Table */}
        <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15">
          {customers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No registered customers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-400">
                <thead>
                  <tr className="border-b border-[#C9A84C]/10 text-gray-500 uppercase">
                    <th className="py-3 px-2 font-bold">Initials</th>
                    <th className="py-3 px-2 font-bold">Username</th>
                    <th className="py-3 px-2 font-bold">Full Name</th>
                    <th className="py-3 px-2 font-bold">Email Address</th>
                    <th className="py-3 px-2 font-bold">Phone Number</th>
                    <th className="py-3 px-2 font-bold">Shipping Address</th>
                    <th className="py-3 px-2 font-bold">Registration Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.id} className="border-b border-[#C9A84C]/5 hover:bg-white/2 transition-colors">
                      <td className="py-3.5 px-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[10px]" style={{ background: "linear-gradient(135deg, #C9A84C, #8B6914)" }}>
                          {c.first_name ? c.first_name[0].toUpperCase() : c.username[0].toUpperCase()}
                        </div>
                      </td>
                      <td className="py-3.5 px-2 font-bold text-white">@{c.username}</td>
                      <td className="py-3.5 px-2 text-white">
                        {c.first_name || c.last_name ? `${c.first_name} ${c.last_name}` : <span className="italic text-gray-600">Not specified</span>}
                      </td>
                      <td className="py-3.5 px-2 font-mono">{c.email}</td>
                      <td className="py-3.5 px-2">{c.phone || <span className="text-gray-600">-</span>}</td>
                      <td className="py-3.5 px-2 max-w-[200px] truncate">
                        {c.address ? `${c.address}, ${c.city}, ${c.state} - ${c.pincode}` : <span className="italic text-gray-600">No address saved</span>}
                      </td>
                      <td className="py-3.5 px-2">{new Date(c.date_joined).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h2 className="text-2xl font-semibold text-white font-serif">Customer Reviews & Testimonials</h2>
          <p className="text-xs text-gray-500 mt-1">Approve or hide testimonial reviews to display on the storefront landing page.</p>
        </div>

        {/* Reviews Listing */}
        <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No review submissions found.</div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-5 rounded-2xl bg-black/45 border border-[#C9A84C]/10 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-[#C9A84C]/25 text-[#C9A84C] flex items-center justify-center font-bold text-[10px] uppercase font-mono">
                        {r.avatar_initials}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{r.name}</p>
                        <p className="text-[10px] text-gray-500">Rating: <strong className="text-[#C9A84C]">{r.rating} ★</strong> {r.product_name && ` | Product: ${r.product_name}`}</p>
                      </div>
                      <span
                        className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          r.is_active ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}
                      >
                        {r.is_active ? "Approved / Active" : "Hidden / Disapproved"}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-300 italic">"{r.text}"</p>
                  </div>

                  <div className="flex gap-2 self-end md:self-center">
                    <button
                      onClick={() => handleToggleReviewActive(r.id, r.is_active)}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-[9px] uppercase tracking-wider font-bold transition-all ${
                        r.is_active
                          ? "border-rose-500/20 text-rose-400 hover:bg-rose-500/10"
                          : "border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10"
                      }`}
                    >
                      {r.is_active ? <EyeOff size={10} /> : <Eye size={10} />}
                      {r.is_active ? "Hide Review" : "Approve Review"}
                    </button>
                    <button
                      onClick={() => handleDeleteReview(r.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/5 text-gray-400 hover:bg-white/5 hover:text-white text-[9px] uppercase tracking-wider font-bold"
                    >
                      <Trash2 size={10} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderHeroBanners = () => {
    if (!heroCMS) return <div className="text-center py-10 text-gray-500">Loading hero sections configuration...</div>;

    return (
      <div className="space-y-6 animate-fadeIn max-w-4xl">
        <div>
          <h2 className="text-2xl font-semibold text-white font-serif">Hero Banner Landing Slider</h2>
          <p className="text-xs text-gray-500 mt-1">Configure titles, eyebrow text, trust metrics, CTA buttons, and background files.</p>
        </div>

        <form onSubmit={handleSaveHeroCMS} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] border-b border-[#C9A84C]/10 pb-2">Hero Copy & Calls-to-action</h3>
            
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Eyebrow Text</label>
              <input type="text" name="eyebrow_text" defaultValue={heroCMS.eyebrow_text} className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Title Line 1</label>
                <input type="text" name="title_line1" defaultValue={heroCMS.title_line1} className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Line 2 (Italic)</label>
                <input type="text" name="title_line2" defaultValue={heroCMS.title_line2} className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Title Line 3</label>
                <input type="text" name="title_line3" defaultValue={heroCMS.title_line3} className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Description Text</label>
              <textarea name="description" rows={3} defaultValue={heroCMS.description} className="w-full bg-black border border-[#C9A84C]/25 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#C9A84C] resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Primary Button Text</label>
                <input type="text" name="primary_button_text" defaultValue={heroCMS.primary_button_text} className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Primary Button Link</label>
                <input type="text" name="primary_button_link" defaultValue={heroCMS.primary_button_link} className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Secondary Button Text</label>
                <input type="text" name="secondary_button_text" defaultValue={heroCMS.secondary_button_text} className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Secondary Button Link</label>
                <input type="text" name="secondary_button_link" defaultValue={heroCMS.secondary_button_link} className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]" />
              </div>
            </div>

            {/* Trust Stats */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-black/40 border border-[#C9A84C]/10 rounded-2xl">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1 font-bold">Stat 1 Value</label>
                <input type="text" name="stat1_value" defaultValue={heroCMS.stat1_value} className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-1.5 text-[11px] text-white outline-none focus:border-[#C9A84C]" />
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 mt-2 mb-1 font-bold">Stat 1 Label</label>
                <input type="text" name="stat1_label" defaultValue={heroCMS.stat1_label} className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-1.5 text-[11px] text-white outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1 font-bold">Stat 2 Value</label>
                <input type="text" name="stat2_value" defaultValue={heroCMS.stat2_value} className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-1.5 text-[11px] text-white outline-none focus:border-[#C9A84C]" />
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 mt-2 mb-1 font-bold">Stat 2 Label</label>
                <input type="text" name="stat2_label" defaultValue={heroCMS.stat2_label} className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-1.5 text-[11px] text-white outline-none focus:border-[#C9A84C]" />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1 font-bold">Stat 3 Value</label>
                <input type="text" name="stat3_value" defaultValue={heroCMS.stat3_value} className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-1.5 text-[11px] text-white outline-none focus:border-[#C9A84C]" />
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 mt-2 mb-1 font-bold">Stat 3 Label</label>
                <input type="text" name="stat3_label" defaultValue={heroCMS.stat3_label} className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-1.5 text-[11px] text-white outline-none focus:border-[#C9A84C]" />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 space-y-6 h-fit">
            <h3 class="text-sm font-bold uppercase tracking-widest text-[#C9A84C] border-b border-[#C9A84C]/10 pb-2">Hero Assets</h3>
            
            <div className="space-y-2">
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">Background Video</label>
              {heroCMS.video && (
                <p className="text-[10px] text-gray-500 truncate">Saved: <a href={heroCMS.video} target="_blank" className="text-[#C9A84C] hover:underline font-mono">{heroCMS.video}</a></p>
              )}
              <input type="file" name="video" className="w-full text-[10px] text-gray-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[9px] file:font-semibold file:bg-white/10 file:text-white" />
            </div>

            <div className="space-y-2 border-t border-[#C9A84C]/10 pt-4">
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold">Backup Image</label>
              {heroCMS.image && (
                <img src={heroCMS.image} alt="hero backup banner" className="w-full h-24 object-cover rounded-xl border border-[#C9A84C]/10" />
              )}
              <input type="file" name="image" className="w-full text-[10px] text-gray-400 file:mr-2 file:py-1 file:px-2.5 file:rounded-full file:border-0 file:text-[9px] file:font-semibold file:bg-white/10 file:text-white" />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3 bg-gradient-to-r from-[#E0C87A] to-[#C9A84C] text-black text-xs font-bold uppercase tracking-wider rounded-full hover:shadow-lg transition-all"
            >
              {actionLoading ? "Saving Changes..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderWebsiteCMS = () => {
    if (!cmsContent) return <div className="text-center py-10 text-gray-500">Loading cms content details...</div>;
    const { subscribers, messages } = cmsContent;

    return (
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h2 className="text-2xl font-semibold text-white font-serif">Website Content & Inquiries</h2>
          <p className="text-xs text-gray-500 mt-1">Review contact form mailboxes, subscriptions lists, and subscribers metrics.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inbox Inquiries */}
          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 space-y-4">
            <h3 className="text-lg font-semibold text-white font-serif flex items-center gap-2">
              <Mail size={18} className="text-[#C9A84C]" /> Support Mailbox Inquiries ({messages.filter((m: any) => !m.is_read).length} Unread)
            </h3>
            
            {messages.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs">No inquiries received.</div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-2xl bg-black/45 border transition-all space-y-2 ${
                      msg.is_read ? "border-[#C9A84C]/5 opacity-70" : "border-[#C9A84C]/35 border-l-4 border-l-[#C9A84C]"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-white text-xs">{msg.subject}</h4>
                        <p className="text-[10px] text-gray-500 mt-0.5">From: <strong className="text-gray-300">{msg.name}</strong> ({msg.email})</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-gray-500 font-mono">{new Date(msg.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
                        {!msg.is_read && (
                          <button
                            onClick={() => handleMarkMessageRead(msg.id)}
                            className="px-2 py-0.5 rounded-full bg-[#C9A84C]/15 hover:bg-[#C9A84C]/30 text-[#C9A84C] border border-[#C9A84C]/25 text-[8px] font-bold uppercase"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-300 bg-[#0F0D04] p-3 rounded-xl border border-white/5 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Newsletter Subscribers */}
          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 space-y-4">
            <h3 className="text-lg font-semibold text-white font-serif flex items-center gap-2">
              <CheckCircle size={18} className="text-[#C9A84C]" /> Newsletter Subscriptions ({subscribers.length})
            </h3>

            {subscribers.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-xs">No email subscribers registered.</div>
            ) : (
              <div className="overflow-x-auto max-h-[50vh] overflow-y-auto pr-2">
                <table className="w-full text-left text-xs text-gray-400">
                  <thead>
                    <tr className="border-b border-[#C9A84C]/10 text-gray-500 uppercase">
                      <th className="py-2.5 px-2 font-bold">Email Address</th>
                      <th className="py-2.5 px-2 font-bold">Date Subscribed</th>
                      <th className="py-2.5 px-2 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub: any) => (
                      <tr key={sub.id} className="border-b border-[#C9A84C]/5 hover:bg-white/2">
                        <td className="py-3 px-2 text-white font-medium">{sub.email}</td>
                        <td className="py-3 px-2 text-gray-500">{new Date(sub.subscribed_at).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</td>
                        <td className="py-3 px-2 text-right">
                          <button onClick={() => handleDeleteSubscriber(sub.id)} className="text-rose-500 hover:text-rose-400 font-bold uppercase text-[9px]">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    if (!siteSettings) return <div className="text-center py-10 text-gray-500">Loading settings variables...</div>;

    return (
      <div className="space-y-6 animate-fadeIn max-w-4xl">
        <div>
          <h2 className="text-2xl font-semibold text-white font-serif">General Site Configurations</h2>
          <p className="text-xs text-gray-500 mt-1">Configure site taglines, promotions, timers, shipping thresholds, and socials.</p>
        </div>

        <form onSubmit={handleSaveSettings} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] border-b border-[#C9A84C]/10 pb-2">Announcements & Promos</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Site Name</label>
                <input
                  type="text"
                  value={siteSettings.site_name}
                  onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                  className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Tagline</label>
                <input
                  type="text"
                  value={siteSettings.tagline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                  className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Announcement Bar Text</label>
              <input
                type="text"
                value={siteSettings.announcement_bar_text}
                onChange={(e) => setSiteSettings({ ...siteSettings, announcement_bar_text: e.target.value })}
                className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-[#C9A84C]/5 pt-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Offer Title</label>
                <input
                  type="text"
                  value={siteSettings.offer_title}
                  onChange={(e) => setSiteSettings({ ...siteSettings, offer_title: e.target.value })}
                  className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Offer Subtitle</label>
                <input
                  type="text"
                  value={siteSettings.offer_subtitle}
                  onChange={(e) => setSiteSettings({ ...siteSettings, offer_subtitle: e.target.value })}
                  className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Offer Description</label>
                <input
                  type="text"
                  value={siteSettings.offer_description}
                  onChange={(e) => setSiteSettings({ ...siteSettings, offer_description: e.target.value })}
                  className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1 font-bold">Offer Promo Code</label>
                <input
                  type="text"
                  value={siteSettings.offer_code}
                  onChange={(e) => setSiteSettings({ ...siteSettings, offer_code: e.target.value })}
                  className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            {/* Countdown timers */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-black/40 border border-[#C9A84C]/10 rounded-2xl">
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1 font-bold">Sale Timer Hours</label>
                <input
                  type="number"
                  value={siteSettings.offer_hours}
                  onChange={(e) => setSiteSettings({ ...siteSettings, offer_hours: e.target.value })}
                  className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1 font-bold">Sale Timer Mins</label>
                <input
                  type="number"
                  value={siteSettings.offer_mins}
                  onChange={(e) => setSiteSettings({ ...siteSettings, offer_mins: e.target.value })}
                  className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-wider text-gray-500 mb-1 font-bold">Sale Timer Secs</label>
                <input
                  type="number"
                  value={siteSettings.offer_secs}
                  onChange={(e) => setSiteSettings({ ...siteSettings, offer_secs: e.target.value })}
                  className="w-full bg-[#0F0D04] border border-[#C9A84C]/20 rounded-full px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[#0F0D04] border border-[#C9A84C]/15 space-y-6 h-fit">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] border-b border-[#C9A84C]/10 pb-2">Shipping & Metadata</h3>
            
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Free Shipping Threshold (Rs.)</label>
              <input
                type="number"
                value={siteSettings.free_shipping_threshold}
                onChange={(e) => setSiteSettings({ ...siteSettings, free_shipping_threshold: e.target.value })}
                className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Instagram Handle</label>
              <input
                type="text"
                value={siteSettings.instagram_handle}
                onChange={(e) => setSiteSettings({ ...siteSettings, instagram_handle: e.target.value })}
                className="w-full bg-black border border-[#C9A84C]/25 rounded-full px-4 py-2 text-xs text-white outline-none focus:border-[#C9A84C]"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-bold">Footer description</label>
              <textarea
                rows={4}
                value={siteSettings.footer_description}
                onChange={(e) => setSiteSettings({ ...siteSettings, footer_description: e.target.value })}
                className="w-full bg-black border border-[#C9A84C]/25 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#C9A84C] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={actionLoading}
              className="w-full py-3 bg-gradient-to-r from-[#E0C87A] to-[#C9A84C] text-black text-xs font-bold uppercase tracking-wider rounded-full hover:shadow-lg transition-all animate-bounceShort"
            >
              {actionLoading ? "Updating Configurations..." : "Save Settings"}
            </button>
          </div>
        </form>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060400] flex items-center justify-center text-[#C9A84C]">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#C9A84C]" size={32} />
          <span className="text-xs uppercase tracking-widest font-semibold">Verifying credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex text-[#F0E8D0] bg-[#060400]">
      {/* Responsive Sidebar for desktop & mobile */}
      <aside
        className={`w-64 bg-black border-r border-[#C9A84C]/15 flex flex-col shrink-0 z-40 transition-transform duration-300 fixed md:static inset-y-0 left-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand header */}
        <div className="p-6 border-b border-[#C9A84C]/15 flex items-center justify-between">
          <BrandLogo
            containerClassName="gap-3"
            imageClassName="h-12 w-12 shrink-0 object-contain"
            titleClassName="text-[0.82rem] font-bold tracking-[0.12em] text-[#C9A84C]"
            taglineClassName="mt-1 text-[9px] tracking-[0.25em] uppercase text-gray-500"
          />
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Tabs */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => { navigate("/dashboard"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeTab === "overview" ? "bg-white/5 text-white border-l-2 border-l-[#C9A84C]" : "text-gray-400 hover:text-white hover:bg-white/2"
            }`}
          >
            <LayoutDashboard size={16} className="text-[#C9A84C]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { navigate("/admin/products"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeTab === "products" ? "bg-white/5 text-white border-l-2 border-l-[#C9A84C]" : "text-gray-400 hover:text-white hover:bg-white/2"
            }`}
          >
            <Package size={16} className="text-[#C9A84C]" />
            <span>Products</span>
          </button>

          <button
            onClick={() => { navigate("/admin/categories"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeTab === "categories" ? "bg-white/5 text-white border-l-2 border-l-[#C9A84C]" : "text-gray-400 hover:text-white hover:bg-white/2"
            }`}
          >
            <FolderHeart size={16} className="text-[#C9A84C]" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => { navigate("/admin/orders"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeTab === "orders" ? "bg-white/5 text-white border-l-2 border-l-[#C9A84C]" : "text-gray-400 hover:text-white hover:bg-white/2"
            }`}
          >
            <ShoppingBag size={16} className="text-[#C9A84C]" />
            <span>Orders</span>
          </button>

          <button
            onClick={() => { navigate("/admin/customers"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeTab === "customers" ? "bg-white/5 text-white border-l-2 border-l-[#C9A84C]" : "text-gray-400 hover:text-white hover:bg-white/2"
            }`}
          >
            <Users size={16} className="text-[#C9A84C]" />
            <span>Customers</span>
          </button>

          <button
            onClick={() => { navigate("/admin/reviews"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeTab === "reviews" ? "bg-white/5 text-white border-l-2 border-l-[#C9A84C]" : "text-gray-400 hover:text-white hover:bg-white/2"
            }`}
          >
            <MessageSquare size={16} className="text-[#C9A84C]" />
            <span>Reviews</span>
          </button>

          <div className="pt-4 pb-2 text-[9px] tracking-widest font-bold text-gray-500 uppercase px-4 border-t border-[#C9A84C]/5">Homepage Banner</div>
          <button
            onClick={() => { navigate("/admin/hero-banners"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeTab === "hero" ? "bg-white/5 text-white border-l-2 border-l-[#C9A84C]" : "text-gray-400 hover:text-white hover:bg-white/2"
            }`}
          >
            <ImageIcon size={16} className="text-[#C9A84C]" />
            <span>Hero Banners</span>
          </button>

          <div className="pt-4 pb-2 text-[9px] tracking-widest font-bold text-gray-500 uppercase px-4 border-t border-[#C9A84C]/5">Core Content</div>
          <button
            onClick={() => { navigate("/admin/cms"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeTab === "cms" ? "bg-white/5 text-white border-l-2 border-l-[#C9A84C]" : "text-gray-400 hover:text-white hover:bg-white/2"
            }`}
          >
            <FileText size={16} className="text-[#C9A84C]" />
            <span>Website Content / CMS</span>
          </button>

          <button
            onClick={() => { navigate("/admin/settings"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-semibold uppercase tracking-wider ${
              activeTab === "settings" ? "bg-white/5 text-white border-l-2 border-l-[#C9A84C]" : "text-gray-400 hover:text-white hover:bg-white/2"
            }`}
          >
            <SettingsIcon size={16} className="text-[#C9A84C]" />
            <span>Settings</span>
          </button>
        </nav>

        {/* User bottom profile & Logout */}
        <div className="p-4 border-t border-[#C9A84C]/15 bg-black/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center font-bold text-[#C9A84C] text-[10px] border border-[#C9A84C]/20 uppercase">
              {user?.username?.slice(0, 2) || "AD"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.username || "Administrator"}</p>
              <p className="text-[8px] text-gray-500 uppercase tracking-wider">Super Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-grow flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-black border-b border-[#C9A84C]/15 flex items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-gray-400 hover:text-white">
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3">
              <BrandLogo
                showTagline={false}
                containerClassName="gap-2.5"
                imageClassName="h-9 w-9 shrink-0 object-contain"
                titleClassName="text-[0.64rem] font-extrabold tracking-[0.1em] text-[#C9A84C]"
              />
              <h1 className="text-[10px] font-extrabold tracking-widest text-[#C9A84C]">ADMIN</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-[10px] uppercase font-bold text-[#C9A84C] hover:underline flex items-center gap-1.5">
              <span>View Storefront</span>
            </a>
          </div>
        </header>

        {/* Content workspace */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Success / Error Toast Banners */}
          {successMsg && (
            <div className="p-4 rounded-2xl bg-emerald-950/45 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <span>✓ {successMsg}</span>
              <button onClick={() => setSuccessMsg("")} className="opacity-60 hover:opacity-100 font-bold">&times;</button>
            </div>
          )}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-950/45 text-[#ff5277] border border-rose-500/30 text-xs font-semibold flex items-center justify-between animate-fadeIn">
              <span>✕ {errorMsg}</span>
              <button onClick={() => setErrorMsg("")} className="opacity-60 hover:opacity-100 font-bold">&times;</button>
            </div>
          )}

          {activeTab === "overview" && renderOverview()}
          {activeTab === "products" && renderProducts()}
          {activeTab === "categories" && renderCategories()}
          {activeTab === "orders" && renderOrders()}
          {activeTab === "customers" && renderCustomers()}
          {activeTab === "reviews" && renderReviews()}
          {activeTab === "hero" && renderHeroBanners()}
          {activeTab === "cms" && renderWebsiteCMS()}
          {activeTab === "settings" && renderSettings()}
        </main>
      </div>
    </div>
  );
}

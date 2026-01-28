import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Image,
  Users,
  ShoppingCart,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

interface MediaItem {
  id: number;
  title: string;
  type: string;
  category: string | null;
  r2_key: string;
  is_published: number;
  display_order: number;
}

interface Contact {
  id: number;
  email: string;
  first_name: string | null;
  lead_magnet: string | null;
  subscribed_at: string;
}

interface Order {
  id: number;
  order_number: string;
  customer_email: string;
  payment_status: string;
  total_amount_cents: number;
  currency: string;
  created_at: string;
}

const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

export default function Admin() {
  const { isAuthenticated, user, isLoading: authLoading } = useMemberAccess();
  const [activeTab, setActiveTab] = useState<'media' | 'contacts' | 'orders'>('media');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadType, setUploadType] = useState('photo');
  const [uploadCategory, setUploadCategory] = useState('');

  const isAdmin = user && ADMIN_EMAILS.includes(user.email.toLowerCase());

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin, activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');

    try {
      if (activeTab === 'media') {
        const res = await fetch('/api/media', { credentials: 'include' });
        const data = await res.json();
        setMedia(data.items || []);
      } else if (activeTab === 'contacts') {
        const res = await fetch('/api/admin/contacts', { credentials: 'include' });
        const data = await res.json();
        setContacts(data.contacts || []);
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/admin/orders', { credentials: 'include' });
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadTitle) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle);
      formData.append('type', uploadType);
      formData.append('category', uploadCategory);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Upload failed');

      // Reset form and refresh
      setUploadFile(null);
      setUploadTitle('');
      setUploadCategory('');
      fetchData();
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const togglePublish = async (id: number, currentStatus: number) => {
    try {
      await fetch(`/api/admin/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: currentStatus ? 0 : 1 }),
        credentials: 'include',
      });
      fetchData();
    } catch (err) {
      setError('Failed to update');
    }
  };

  const deleteMedia = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchData();
    } catch (err) {
      setError('Failed to delete');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/members" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="card max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          {[
            { key: 'media', label: 'Media', icon: Image },
            { key: 'contacts', label: 'Contacts', icon: Users },
            { key: 'orders', label: 'Orders', icon: ShoppingCart },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="mr-2" size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            {/* Upload Form */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Media</h2>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <label className="label">File</label>
                    <input
                      type="file"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Title</label>
                    <input
                      type="text"
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="input"
                      placeholder="Enter title"
                      required
                    />
                  </div>
                  <div>
                    <label className="label">Type</label>
                    <select
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value)}
                      className="input"
                    >
                      <option value="photo">Photo</option>
                      <option value="video">Video</option>
                      <option value="book">Book/PDF</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="input"
                    >
                      <option value="">Select category</option>
                      <option value="hero_photo">Hero Photo</option>
                      <option value="profile">Profile</option>
                      <option value="product_cover">Product Cover</option>
                      <option value="course_module">Course Module</option>
                      <option value="brand_logo">Brand Logo</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="btn-primary"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Uploading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Upload className="mr-2" size={20} />
                      Upload
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Media List */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Media Library</h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
                </div>
              ) : media.length === 0 ? (
                <p className="text-gray-600 text-center py-8">No media uploaded yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Category</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {media.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{item.title}</td>
                          <td className="py-3 px-4 capitalize">{item.type}</td>
                          <td className="py-3 px-4">{item.category || '-'}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                item.is_published
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {item.is_published ? 'Published' : 'Draft'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => togglePublish(item.id, item.is_published)}
                                className="p-2 text-gray-600 hover:text-primary-600"
                                title={item.is_published ? 'Unpublish' : 'Publish'}
                              >
                                {item.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                              <button
                                onClick={() => deleteMedia(item.id)}
                                className="p-2 text-gray-600 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Email Subscribers ({contacts.length})
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
              </div>
            ) : contacts.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No subscribers yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Lead Magnet</th>
                      <th className="text-left py-3 px-4">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{contact.email}</td>
                        <td className="py-3 px-4">{contact.first_name || '-'}</td>
                        <td className="py-3 px-4">{contact.lead_magnet || '-'}</td>
                        <td className="py-3 px-4">
                          {new Date(contact.subscribed_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Orders ({orders.length})
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Order #</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm">{order.order_number}</td>
                        <td className="py-3 px-4">{order.customer_email}</td>
                        <td className="py-3 px-4">
                          {order.currency === 'ZAR' ? 'R' : '$'}
                          {(order.total_amount_cents / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              order.payment_status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : order.payment_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

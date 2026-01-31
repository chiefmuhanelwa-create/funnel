import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Image,
  Users,
  ShoppingCart,
  Upload,
  Trash2,
  Loader2,
  AlertCircle,
  FileText,
  Video,
  Copy,
  Check,
  FolderOpen,
  ExternalLink,
  Key,
  Plus,
  X,
  Search,
} from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';
import { upload } from '@vercel/blob/client';
import { PRODUCTS } from '../config/products';

interface MediaItem {
  id: number;
  title: string;
  type: string;
  category: string | null;
  file_url: string;
  is_published: boolean;
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

interface BlobFile {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface AccessRecord {
  customer_email: string;
  product_keys: string[];
  product_names: string[];
  first_access: string;
  product_count: number;
}

const ADMIN_EMAILS = [
  'info@nochill.co.za',
  'ndivhuwo@nochill.co.za',
  'chiefmuhanelwa@gmail.com',
];

type TabKey = 'files' | 'media' | 'contacts' | 'orders' | 'access';

export default function Admin() {
  const { isAuthenticated, user, isLoading: authLoading } = useMemberAccess();
  const [activeTab, setActiveTab] = useState<TabKey>('files');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [files, setFiles] = useState<BlobFile[]>([]);
  const [accessRecords, setAccessRecords] = useState<AccessRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Access management state
  const [grantEmail, setGrantEmail] = useState('');
  const [grantProduct, setGrantProduct] = useState('starter-kit');
  const [isGranting, setIsGranting] = useState(false);
  const [searchEmail, setSearchEmail] = useState('');
  const [showGrantForm, setShowGrantForm] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState<'image' | 'pdf' | 'video'>('image');
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (activeTab === 'files') {
        const res = await fetch(`/api/upload?folder=${selectedFolder}`, {
          headers: { 'X-Admin-Email': user?.email || '' },
        });
        const data = await res.json();
        setFiles(data.files || []);
      } else if (activeTab === 'media') {
        const res = await fetch('/api/media');
        const data = await res.json();
        setMedia(data.items || []);
      } else if (activeTab === 'contacts') {
        const res = await fetch('/api/admin/contacts', {
          headers: { 'X-Admin-Email': user?.email || '' },
        });
        const data = await res.json();
        setContacts(data.contacts || []);
      } else if (activeTab === 'orders') {
        const res = await fetch('/api/admin/orders', {
          headers: { 'X-Admin-Email': user?.email || '' },
        });
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (activeTab === 'access') {
        const res = await fetch('/api/admin/access', {
          headers: { 'X-Admin-Email': user?.email || '' },
        });
        const data = await res.json();
        setAccessRecords(data.access || []);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrantAccess = async () => {
    if (!grantEmail || !grantProduct) {
      setError('Email and product are required');
      return;
    }

    setIsGranting(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': user?.email || '',
        },
        body: JSON.stringify({
          email: grantEmail,
          productKey: grantProduct,
          includeBundles: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to grant access');
      }

      setSuccess(data.message);
      setGrantEmail('');
      setShowGrantForm(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to grant access');
    } finally {
      setIsGranting(false);
    }
  };

  const handleRevokeAccess = async (email: string, productKey?: string) => {
    const action = productKey ? `revoke access to ${productKey}` : 'revoke ALL access';
    if (!confirm(`Are you sure you want to ${action} for ${email}?`)) return;

    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/access', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': user?.email || '',
        },
        body: JSON.stringify({
          email,
          productKey,
          revokeAll: !productKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to revoke access');
      }

      setSuccess(data.message);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke access');
    }
  };

  const handleSeedProducts = async () => {
    if (!confirm('This will seed all products into the database. Continue?')) return;

    setIsSeeding(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/seed-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Email': user?.email || '',
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to seed products');
      }

      setSuccess(`${data.message}. Products in database: ${data.products?.length || 0}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed products');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError('');
    setSuccess('');

    try {
      // For large files (PDFs and videos), use client-side upload to bypass 4.5MB serverless limit
      if (uploadType === 'pdf' || uploadType === 'video') {
        // Get upload URL and token from server
        const urlRes = await fetch('/api/upload/get-upload-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: user?.email,
            fileType: uploadType,
            fileName: file.name,
            contentType: file.type,
          }),
        });

        const urlData = await urlRes.json();

        if (!urlRes.ok) {
          throw new Error(urlData.error || 'Failed to get upload URL');
        }

        // Check file size on client side
        if (file.size > urlData.maxSize) {
          throw new Error(`File too large. Maximum size: ${urlData.maxSize / 1024 / 1024}MB`);
        }

        // Use client-side upload directly to Vercel Blob
        setUploadProgress(10);

        const blob = await upload(urlData.pathname, file, {
          access: 'public',
          handleUploadUrl: '/api/upload/client-upload',
          clientPayload: JSON.stringify({
            email: user?.email,
            fileType: uploadType,
          }),
        });

        setUploadProgress(100);
        setSuccess(`File uploaded successfully! URL: ${blob.url}`);
      } else {
        // For images (small files), use server-side upload
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': file.type,
            'X-Admin-Email': user?.email || '',
            'X-File-Type': uploadType,
            'X-File-Name': file.name,
          },
          body: file,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Upload failed');
        }

        setSuccess(`File uploaded successfully! URL: ${data.url}`);
      }

      fetchData();

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteFile = async (url: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const res = await fetch(`/api/upload?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Email': user?.email || '' },
      });

      if (!res.ok) throw new Error('Delete failed');

      setSuccess('File deleted successfully');
      fetchData();
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (pathname: string) => {
    if (pathname.includes('images/')) return <Image size={20} className="text-blue-400" />;
    if (pathname.includes('books/')) return <FileText size={20} className="text-red-400" />;
    if (pathname.includes('videos/')) return <Video size={20} className="text-purple-400" />;
    return <FileText size={20} className="text-gray-400" />;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <Loader2 className="w-12 h-12 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/members" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-20">
        <div className="glass-card max-w-md text-center p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-500">
            You don't have permission to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'files' as TabKey, label: 'Files', icon: FolderOpen },
            { key: 'access' as TabKey, label: 'Access', icon: Key },
            { key: 'orders' as TabKey, label: 'Orders', icon: ShoppingCart },
            { key: 'contacts' as TabKey, label: 'Contacts', icon: Users },
            { key: 'media' as TabKey, label: 'Media', icon: Image },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center px-4 py-2 rounded-xl font-medium transition ${
                activeTab === tab.key
                  ? 'bg-gold-500 text-gray-900'
                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
              }`}
            >
              <tab.icon className="mr-2" size={20} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl">
            {success}
          </div>
        )}

        {/* Files Tab - Upload to Vercel Blob */}
        {activeTab === 'files' && (
          <div className="space-y-6">
            {/* Upload Form */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Files</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="label">File Type</label>
                  <select
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value as any)}
                    className="input"
                  >
                    <option value="image">Image (JPG, PNG, WebP)</option>
                    <option value="pdf">PDF (Books, Workbooks)</option>
                    <option value="video">Video (MP4, WebM)</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="label">Select File</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept={
                      uploadType === 'image'
                        ? 'image/jpeg,image/png,image/webp,image/gif'
                        : uploadType === 'pdf'
                        ? 'application/pdf'
                        : 'video/mp4,video/webm,video/quicktime'
                    }
                    className="input file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gold-500 file:text-gray-900 file:font-medium hover:file:bg-gold-400"
                    disabled={isUploading}
                  />
                </div>
              </div>

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-500">
                    <Loader2 className="animate-spin" size={20} />
                    <span>
                      {uploadProgress > 0
                        ? `Uploading... ${uploadProgress}%`
                        : 'Preparing upload...'}
                    </span>
                  </div>
                  {uploadProgress > 0 && (
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gold-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-sm font-medium text-gray-600 mb-2">File Limits:</h3>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>Images: Max 5MB (JPG, PNG, WebP, GIF) - fast server upload</li>
                  <li>PDFs: Max 50MB - direct browser upload</li>
                  <li>Videos: Max 500MB (MP4, WebM) - direct browser upload</li>
                </ul>
                <p className="text-xs text-gray-400 mt-2">
                  Large files (PDFs, videos) upload directly to storage for better reliability.
                </p>
              </div>
            </div>

            {/* Folder Filter */}
            <div className="flex gap-2">
              {['', 'images', 'books', 'videos'].map((folder) => (
                <button
                  key={folder}
                  onClick={() => {
                    setSelectedFolder(folder);
                    fetchData();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    selectedFolder === folder
                      ? 'bg-gold-500 text-gray-900'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {folder || 'All Files'}
                </button>
              ))}
            </div>

            {/* Files List */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Uploaded Files ({files.length})
              </h2>
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
                </div>
              ) : files.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No files uploaded yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">File</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Size</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Uploaded</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file) => (
                        <tr
                          key={file.url}
                          className="border-b border-white/5 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.pathname)}
                              <div>
                                <p className="text-gray-900 font-medium text-sm truncate max-w-xs">
                                  {file.pathname.split('/').pop()}
                                </p>
                                <p className="text-gray-400 text-xs">{file.pathname}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-sm">
                            {formatFileSize(file.size)}
                          </td>
                          <td className="py-3 px-4 text-gray-500 text-sm">
                            {new Date(file.uploadedAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copyToClipboard(file.url)}
                                className="p-2 text-gray-500 hover:text-gold-500 transition-colors"
                                title="Copy URL"
                              >
                                {copiedUrl === file.url ? (
                                  <Check size={18} className="text-green-400" />
                                ) : (
                                  <Copy size={18} />
                                )}
                              </button>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-500 hover:text-gold-500 transition-colors"
                                title="Open"
                              >
                                <ExternalLink size={18} />
                              </a>
                              <button
                                onClick={() => handleDeleteFile(file.url)}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors"
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

            {/* Usage Instructions */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">How to Use Files</h2>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Hero Images:</h3>
                  <p>
                    Upload to <code className="text-gold-400">images/</code> folder, then use URL in
                    Hero.tsx component.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">PDFs (eBooks, Workbooks):</h3>
                  <p>
                    Upload to <code className="text-gold-400">books/</code> folder. Update product
                    links in Members.tsx to point to the URL.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Course Videos:</h3>
                  <p>
                    Upload to <code className="text-gold-400">videos/</code> folder. Add video URLs
                    to product_files table in database.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Media Library</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
              </div>
            ) : media.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No media in database yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600">Title</th>
                      <th className="text-left py-3 px-4 text-gray-600">Type</th>
                      <th className="text-left py-3 px-4 text-gray-600">Category</th>
                      <th className="text-left py-3 px-4 text-gray-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {media.map((item) => (
                      <tr key={item.id} className="border-b border-white/5 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{item.title}</td>
                        <td className="py-3 px-4 text-gray-500 capitalize">{item.type}</td>
                        <td className="py-3 px-4 text-gray-500">{item.category || '-'}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              item.is_published
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {item.is_published ? 'Published' : 'Draft'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Email Subscribers ({contacts.length})
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
              </div>
            ) : contacts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No subscribers yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600">Email</th>
                      <th className="text-left py-3 px-4 text-gray-600">Name</th>
                      <th className="text-left py-3 px-4 text-gray-600">Lead Magnet</th>
                      <th className="text-left py-3 px-4 text-gray-600">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-b border-white/5 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{contact.email}</td>
                        <td className="py-3 px-4 text-gray-500">{contact.first_name || '-'}</td>
                        <td className="py-3 px-4 text-gray-500">{contact.lead_magnet || '-'}</td>
                        <td className="py-3 px-4 text-gray-500">
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
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Orders ({orders.length})</h2>
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-gold-500 animate-spin mx-auto" />
              </div>
            ) : orders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-gray-600">Order #</th>
                      <th className="text-left py-3 px-4 text-gray-600">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-sm text-gray-900">
                          {order.order_number}
                        </td>
                        <td className="py-3 px-4 text-gray-500">{order.customer_email}</td>
                        <td className="py-3 px-4 text-gray-900">
                          {order.currency === 'ZAR' ? 'R' : '$'}
                          {(order.total_amount_cents / 100).toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                              order.payment_status === 'completed'
                                ? 'bg-green-500/20 text-green-400'
                                : order.payment_status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">
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

        {/* Access Management Tab */}
        {activeTab === 'access' && (
          <div className="space-y-6">
            {/* Grant Access Form */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Customer Access Management</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSeedProducts}
                    disabled={isSeeding}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {isSeeding ? <Loader2 className="animate-spin" size={18} /> : null}
                    {isSeeding ? 'Seeding...' : 'Seed Products DB'}
                  </button>
                  <button
                    onClick={() => setShowGrantForm(!showGrantForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                  >
                    {showGrantForm ? <X size={18} /> : <Plus size={18} />}
                    {showGrantForm ? 'Cancel' : 'Grant Access'}
                  </button>
                </div>
              </div>

              {showGrantForm && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <h3 className="font-medium text-gray-900 mb-3">Grant Product Access</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Email
                      </label>
                      <input
                        type="email"
                        value={grantEmail}
                        onChange={(e) => setGrantEmail(e.target.value)}
                        placeholder="customer@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product
                      </label>
                      <select
                        value={grantProduct}
                        onChange={(e) => setGrantProduct(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        {Object.entries(PRODUCTS).map(([key, product]) => (
                          <option key={key} value={key}>
                            {product.icon} {product.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleGrantAccess}
                        disabled={isGranting || !grantEmail}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {isGranting ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : (
                          <Check size={18} />
                        )}
                        Grant Access
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 mt-2">
                    Bundle products (Starter Kit, Pro Bundle) will automatically include all bundled items.
                  </p>
                </div>
              )}

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="Search by email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Access Records Table */}
              {isLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
                </div>
              ) : accessRecords.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No customer access records found</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Products</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Since</th>
                        <th className="text-left py-3 px-4 text-gray-600 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accessRecords
                        .filter(
                          (record) =>
                            !searchEmail ||
                            record.customer_email.toLowerCase().includes(searchEmail.toLowerCase())
                        )
                        .map((record) => (
                          <tr
                            key={record.customer_email}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <span className="font-medium text-gray-900">{record.customer_email}</span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {record.product_keys.map((key, i) => (
                                  <span
                                    key={key}
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-amber-100 text-amber-800"
                                  >
                                    {PRODUCTS[key]?.icon || '📦'} {PRODUCTS[key]?.shortName || key}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-500 text-sm">
                              {new Date(record.first_access).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleRevokeAccess(record.customer_email)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                              >
                                Revoke All
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
        )}
      </div>
    </div>
  );
}

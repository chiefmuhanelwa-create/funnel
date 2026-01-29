import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, BookOpen, Settings, LogOut, Mail, Shield, ArrowLeft } from 'lucide-react';
import { useMemberAccess } from '../context/MemberAccessContext';

export default function Dashboard() {
  const { isAuthenticated, user, logout, getAllAccessibleProducts, emailAccess } = useMemberAccess();

  if (!isAuthenticated && !emailAccess) {
    return <Navigate to="/members" replace />;
  }

  const accessibleProducts = getAllAccessibleProducts();
  const userEmail = user?.email || emailAccess?.email || '';
  const userName = user?.name || 'Member';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Hub Navigation */}
        <Link
          to="/members"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to My Hub
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header */}
          <div className="card mb-8">
            <div className="flex items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{userName}</h1>
                <p className="text-gray-600">{userEmail}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Account Info */}
            <div className="card">
              <div className="flex items-center mb-6">
                <User className="text-primary-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">Account</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{userEmail}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Authentication</label>
                  <p className="text-gray-900 flex items-center">
                    {user ? (
                      <>
                        <Shield className="text-green-500 mr-2" size={16} />
                        Google Account
                      </>
                    ) : (
                      <>
                        <Mail className="text-blue-500 mr-2" size={16} />
                        Email Access
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="card">
              <div className="flex items-center mb-6">
                <BookOpen className="text-primary-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-900">My Products</h2>
              </div>

              {accessibleProducts.length === 0 ? (
                <p className="text-gray-600">No products yet.</p>
              ) : (
                <ul className="space-y-3">
                  {accessibleProducts.map((key) => (
                    <li key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900 capitalize">
                        {key.replace(/-/g, ' ')}
                      </span>
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        Active
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Link
                to="/members"
                className="mt-6 inline-flex items-center text-primary-600 font-medium"
              >
                Access Content →
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="card md:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>

              <div className="grid sm:grid-cols-3 gap-4">
                <Link
                  to="/members"
                  className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition"
                >
                  <BookOpen className="text-primary-600 mr-3" size={24} />
                  <div>
                    <div className="font-medium text-gray-900">My Content</div>
                    <div className="text-sm text-gray-600">Access your courses</div>
                  </div>
                </Link>

                <a
                  href="mailto:hello@contentpreneurhub.online"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <Mail className="text-gray-600 mr-3" size={24} />
                  <div>
                    <div className="font-medium text-gray-900">Get Support</div>
                    <div className="text-sm text-gray-600">Contact us</div>
                  </div>
                </a>

                <button
                  onClick={logout}
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-red-50 transition text-left"
                >
                  <LogOut className="text-gray-600 mr-3" size={24} />
                  <div>
                    <div className="font-medium text-gray-900">Sign Out</div>
                    <div className="text-sm text-gray-600">Log out of account</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

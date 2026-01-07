import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProtectedAdminRoute from './components/Admin/ProtectedAdminRoute';
import AdminLayout from './components/Admin/AdminLayout';
import Categories from './pages/Admin/Categories';
import CategoryNew from './pages/Admin/CategoryNew';
import CategoryEdit from './pages/Admin/CategoryEdit';
import Items from './pages/Admin/Items';
import ItemNew from './pages/Admin/ItemNew';
import ItemEdit from './pages/Admin/ItemEdit';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        {/* Admin Routes - Protected by unique URL secret */}
        {/* Format: /admin/{your-secret-key} */}
        <Route
          path="/admin/:secret"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Navigate to="categories" replace />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        
        <Route
          path="/admin/:secret/categories"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        
        <Route
          path="/admin/:secret/categories/new"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <CategoryNew />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        
        <Route
          path="/admin/:secret/categories/:id/edit"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <CategoryEdit />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        
        <Route
          path="/admin/:secret/items"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <Items />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        
        <Route
          path="/admin/:secret/items/new"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <ItemNew />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        
        <Route
          path="/admin/:secret/items/:categoryId/:id/edit"
          element={
            <ProtectedAdminRoute>
              <AdminLayout>
                <ItemEdit />
              </AdminLayout>
            </ProtectedAdminRoute>
          }
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

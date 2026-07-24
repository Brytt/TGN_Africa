import AdminShell from '../../src/components/admin/AdminShell'

export const metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | TGN Africa Admin',
  },
  description: 'TGN Africa publishing administration prototype.',
}

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>
}

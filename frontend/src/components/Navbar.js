import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, ShoppingCart, User, LogOut, Package, LayoutDashboard, ChevronDown, Smartphone } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_78d76407-00e9-4982-b8fe-49b9e45052f0/artifacts/strtt6dl_labcellogo.png";

export default function Navbar() {
  const { user, login, logout, loading } = useAuth();
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  const isAdmin = user?.role === 'admin';

  const navLinks = [
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/personalizar', label: 'Personalizar' },
    { href: '/rastrear', label: 'Rastrear Pedido' },
  ];

  return (
    <header className="sticky top-0 z-50 glass shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="nav-logo">
            <img 
              src={LOGO_URL} 
              alt="LABCEL San Antonio" 
              className="h-10 w-10 object-contain transition-transform group-hover:scale-110"
            />
            <span className="font-bold text-lg tracking-tight hidden sm:block">
              LABCEL <span className="text-[#00C853]">San Antonio</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-gray-700 hover:text-[#00C853] transition-colors"
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link 
              to="/carrito" 
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              data-testid="nav-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#00C853] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2" data-testid="user-menu-trigger">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#00C853] flex items-center justify-center text-white font-medium">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm font-medium">{user.name}</div>
                  <div className="px-2 pb-1.5 text-xs text-gray-500">{user.email}</div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/mis-pedidos')} data-testid="menu-my-orders">
                    <Package className="mr-2 h-4 w-4" />
                    Mis Pedidos
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')} data-testid="menu-admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Panel Admin
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600" data-testid="menu-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={login} 
                className="btn-primary text-sm"
                data-testid="nav-login"
              >
                Iniciar Sesión
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-[#00C853] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  {user && (
                    <>
                      <hr />
                      <Link
                        to="/mis-pedidos"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-medium hover:text-[#00C853] transition-colors"
                      >
                        Mis Pedidos
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-lg font-medium hover:text-[#00C853] transition-colors"
                        >
                          Panel Admin
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}

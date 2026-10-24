import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { auth } from '@/auth';
import { handleSignOut } from '@/app/lib/actions';

export default async function SideNav() {
  const session = await auth();
  const role = session?.user?.role || 'user';
  const email = session?.user?.email || 'user@nextmail.com';
  const name = session?.user?.name || email.split('@')[0];

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-36"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AcmeLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>

        {/* User Info & Role Badge */}
        <div className="flex flex-col gap-1 rounded-md bg-gray-50 p-3 text-xs">
          <div className="flex items-center gap-2">
            <UserCircleIcon className="w-5 h-5 text-gray-500" />
            <span className="font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">
              {name}
            </span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-gray-500">Vai trò:</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                role === 'admin'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}
            >
              {role}
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <form action={handleSignOut}>
          <button
            type="submit"
            className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-50 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3 transition-colors"
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Đăng xuất</div>
          </button>
        </form>
      </div>
    </div>
  );
}

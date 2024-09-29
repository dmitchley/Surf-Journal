import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { JSX, useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';



const withAuth = (WrappedComponent: any) => {
  const Auth = (props: any) => {
    const { data: session, status } = useSession();

    const router = useRouter();

    useEffect(() => {

      if (!session) {
        router.push('/login');
      }
    }, [session]);

    if (!session) {
      return (
        <div>

        </div>
      );
    }



    const handleLogout = async () => {
      await signOut({
        redirect: true,
        callbackUrl: '/login',
      });
    };

    return (
      <>
        <div className="min-h-screen flex">
          {/* Left Sidebar */}
          <div className="w-64 bg-gray-800 text-white p-5">
            <h2 className="text-2xl font-bold mb-8">Surf Journal</h2>
            <nav>
              <ul className="space-y-4">
                <li>
                  <button

                    className={`w-full text-left py-2 px-4 rounded-md bg-[#18202b]  "}
                      `}
                  >
                    Dashboard
                  </button>
                </li>

                <h2 className="text-1xl font-bold mb-8 ml-[50px]">Spots</h2>
                <li>
                  <Link href="/koelbay">
                    <button
                      className={`w-full text-left py-2 px-4 rounded-md bg-[#18202b] hover:bg-gray-700'
                  }`}
                    >
                      Koel Bay
                    </button>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => handleLogout()}
                    className="w-full text-left py-2 px-4 rounded-md bg-red-600 hover:bg-red-500"
                  >
                    Log out
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-gray-100 p-10">
            <div>
              <WrappedComponent {...props} />

            </div>
          </div>
        </div>

      </>
    );
  };

  return Auth;
};

export default withAuth;

import { Outlet, useLocation } from 'react-router-dom';

export default function Root() {
  const location = useLocation();
  console.log('location', location);

  const navRoutes = [
    { route: '/products', label: 'Products' },
    { route: '/users', label: 'Users' }
  ];

  return (
    <>
      <div id="sidebar" className="w-64 bg-gray-100 flex flex-col">
        <nav className="overflow-auto pt-4">
          <ul>
            {navRoutes.map((item) => {
              return (
                <li className="pl-8 pr-8 my-3" key={item.label}>
                  <a
                    href={item.route}
                    className={`${
                      location.pathname === item.route ? 'font-bold' : ''
                    } flex items-center justify-between overflow-hidden whitespace-pre p-2 rounded-lg no-underline gap-4 hover:bg-gray-300`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div id="detail" className="pt-8 px-16 w-full flex justify-center">
        <Outlet />
      </div>
    </>
  );
}

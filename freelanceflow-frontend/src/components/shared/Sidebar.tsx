import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="text-lg font-semibold hover:underline">Dashboard</Link>
        <Link to="/clients" className="hover:underline">Clients</Link>
        <Link to="/projects" className="hover:underline">Projects</Link>
        <Link to="/invoices" className="hover:underline">Invoices</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;

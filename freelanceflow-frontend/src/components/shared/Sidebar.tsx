import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-800 p-4">
      <nav className="flex flex-col space-y-2">
        <Link to="/" className="text-lg font-semibold hover:underline">Dashboard</Link>
        <Link to="/clients" className="hover:underline">Clients</Link>
        <Link to="/projects" className="hover:underline">Projects</Link>
        <Link to="/invoices" className="hover:underline">Invoices</Link>
        <Link to="/reports" className="hover:underline">Reports</Link>
        <Link to="/team" className="hover:underline">Team</Link>
        <div className="mt-auto">
          <Link to="/billing" className="hover:underline">Subscription</Link>
          <Link to="/settings" className="hover:underline block mt-2">Settings</Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

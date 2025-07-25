
export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex space-x-4">
        <li><a href="/">Dashboard</a></li>
        <li><a href="/customers">Customers</a></li>
        <li><a href="/orders">Orders</a></li>
        <li><a href="/payments">Payments</a></li>
        <li><a href="/partners">Partners</a></li>
        <li><a href="/sale">Sale</a></li>
      </ul>
    </nav>
  );
}

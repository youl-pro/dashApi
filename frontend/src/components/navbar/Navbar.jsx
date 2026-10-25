import styles from "./navbar.module.css";
import {Bell} from "lucide-react";

function Navbar({setCurrentPage,searchTerm,setSearchTerm, notifications}) {
const nombreNonLues = notifications.filter((n) => !n.isRead).length;
return (
    <div className={styles.navbar}>
<ul>
  <li>
    <input
  type="text"
  placeholder="Recherche"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>
  </li>
  <li>
    <button className={styles.bell} onClick={() => setCurrentPage("notifications")}>
      <Bell size={23} /> {nombreNonLues}
    </button>
  </li>
</ul>
    </div>
  );
}

export default Navbar;

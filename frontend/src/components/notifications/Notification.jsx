import styles  from "./notification.module.css";
import { useEffect } from "react";
function Notification({notifications, onDelete, onMarkAsRead}) {
useEffect(() => {
    notifications
      .filter((n) => !n.isRead)
      .forEach((n) => onMarkAsRead(n.id));
  }, []);


  
 
  return (
    <div id="notification">
      <div className= {styles.title}>
        <h1>Notifications</h1>
      </div>

      <div>
        <table className= {styles.table}>
          <thead>
            <tr>
              <th>Message</th>
              <th>Status</th>
               <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
      
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id}>
                <td>{notification.message}</td>
                <td>{notification.isRead ? "Lu" : "Non lu"}</td>
                <td>{new Date(notification.createdAt).toLocaleDateString("fr-CA")}</td>
                <td>
               <button onClick={() => onDelete(notification.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notification;

import styles from "./setting.module.css";
function Setting() {
  const settings = [
    {
      id: 1,
      name: "Notifications",
      value: "Activées",
    },
    {
      id: 2,
      name: "Mode sombre",
      value: "Activé",
    },
    {
      id: 3,
      name: "Langue",
      value: "Français",
    },
    {
      id: 4,
      name: "Sécurité",
      value: "Activée",
    },
  ];

  return (
    <div id="settings">
      <div className= {styles.title}>
        <h1>Settings</h1>
        <button>Insert</button>
      </div>

      <div>
        <table className= {styles.table}>
          <thead>
            <tr>
              <th>Setting</th>
              <th>Valeur</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id}>
                <td>{setting.name}</td>
                <td>{setting.value}</td>
                <td>
                  <button>Update</button>{" "}
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Setting;

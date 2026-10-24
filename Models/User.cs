namespace dashApi.Models
{
    public class User
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public ICollection<Project> Projects { get; set; } = new List<Project>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }

    
    }

namespace dashApi.Models
{
    public class Project
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }

        // Propriétés de navigation
        public User? User { get; set; }
        public ICollection<TaskItem>? Tasks { get; set; }
    }
}
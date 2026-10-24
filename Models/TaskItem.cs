namespace dashApi.Models
{
    public class TaskItem
    {

        public int Id { get; set; }
         public string Title { get; set; }   
       public string Status { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime?  CreatedAt { get; set; }
        public string Priority { get; set; }
        public Boolean IsImportant { get; set; }
         public int ProjectId {  get; set; }

       public Project? Project  { get; set; }
    }
}

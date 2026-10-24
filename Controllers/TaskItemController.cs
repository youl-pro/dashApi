using dashApi.Data;
using dashApi.Models;
using dashApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace dashApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskItemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationObserver _notifier;

        public TaskItemsController(AppDbContext context, INotificationObserver notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        // GET: api/taskitems
        [HttpGet]
        public ActionResult<List<TaskItem>> GetTasks()
        {
            var tasks = _context.Tasks.ToList();

            return Ok(tasks);
        }



        [HttpGet("{id}")]

        public ActionResult<TaskItem> GetTask(int id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null)
            {
                return NotFound();

            }
            else
            {
                return Ok(task);

            }
        }



        // POST: api/taskitems
        [HttpPost]
        public ActionResult<TaskItem> CreateTask(TaskItem task)
        {

            task.CreatedAt = DateTime.UtcNow;
            task.DueDate = DateTime.UtcNow.AddYears(5);

            _context.Tasks.Add(task);
            _context.SaveChanges();
            _notifier.OnEntityChanged(1, "Une tache a été ajouté !");
            return Ok(task);
        }

        // DELETE: api/taskitems/1
        [HttpDelete("{id}")]
        public ActionResult DeleteTask(int id)
        {

            var task = _context.Tasks.Find(id);

            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            _context.SaveChanges();
            _notifier.OnEntityChanged(1, "Une tache a été suprimé !");
            return Ok(task);
            
        }


        [HttpPut("{id}")]
        public ActionResult<TaskItem> UpdateTask(int id, TaskItem task)
        {
          TaskItem existingTask = _context.Tasks.Find(id);

            if (existingTask == null) { 
            
            return NotFound();


            }
            else
            {
                if (existingTask.ProjectId != task.ProjectId) {

                    return BadRequest();
                
                }
                else
                {
                    existingTask.Title = task.Title;
                    existingTask.Status = task.Status;

                    existingTask.Priority = task.Priority;
                    existingTask.IsImportant = task.IsImportant;

                }
                   

                _context.SaveChanges();
                _notifier.OnEntityChanged(1, "Une tache a été mise à jour !");
                return Ok(existingTask);

            }



        }



    }
}

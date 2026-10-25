using dashApi.Data;
using dashApi.Models;
using dashApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace dashApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]   // l'adresse reste : /api/taskitems
    public class TaskItemsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationObserver _notifier;

        public TaskItemsController(AppDbContext context, INotificationObserver notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        // GET /api/taskitems?userId=5 : seulement les tâches des projets de cet utilisateur
        [HttpGet]
        public ActionResult<List<TaskItem>> GetTasks([FromQuery] int userId)
        {
            if (userId <= 0)
                return BadRequest("userId est obligatoire.");

            // t.Project.UserId : on passe par le projet de la tâche pour trouver son propriétaire
            var tasks = _context.Tasks
                .Where(t => t.Project!.UserId == userId)
                .ToList();
            return Ok(tasks);
        }

        // GET /api/taskitems/3?userId=5 : une tâche, seulement si elle est à cet utilisateur
        [HttpGet("{id}")]
        public ActionResult<TaskItem> GetTask(int id, [FromQuery] int userId)
        {
            var task = _context.Tasks
                .FirstOrDefault(t => t.Id == id && t.Project!.UserId == userId);

            if (task == null) return NotFound();
            return Ok(task);
        }

        // POST /api/taskitems?userId=5 : créer une tâche dans un de SES projets
        [HttpPost]
        public ActionResult<TaskItem> CreateTask(TaskItem task, [FromQuery] int userId)
        {
            // Le projet visé doit exister ET appartenir à cet utilisateur
            if (!_context.Projects.Any(p => p.Id == task.ProjectId && p.UserId == userId))
                return BadRequest("Projet introuvable.");

            task.Id = 0; // c'est la base qui attribue l'Id
            task.CreatedAt = DateTime.UtcNow;
            task.DueDate = DateTime.UtcNow.AddYears(5);

            _context.Tasks.Add(task);
            _context.SaveChanges();

            _notifier.OnEntityChanged(userId, "Une tache a été ajouté !");
            return Ok(task);
        }

        // DELETE /api/taskitems/3?userId=5 : seulement le propriétaire peut supprimer
        [HttpDelete("{id}")]
        public ActionResult DeleteTask(int id, [FromQuery] int userId)
        {
            var task = _context.Tasks
                .FirstOrDefault(t => t.Id == id && t.Project!.UserId == userId);

            // 404 aussi si la tâche existe mais appartient à un autre
            if (task == null) return NotFound();

            _context.Tasks.Remove(task);
            _context.SaveChanges();

            _notifier.OnEntityChanged(userId, "Une tache a été suprimé !");
            return Ok(task);
        }

        // PUT /api/taskitems/3?userId=5 : seulement le propriétaire peut modifier
        [HttpPut("{id}")]
        public ActionResult<TaskItem> UpdateTask(int id, TaskItem task, [FromQuery] int userId)
        {
            var existingTask = _context.Tasks
                .FirstOrDefault(t => t.Id == id && t.Project!.UserId == userId);

            if (existingTask == null) return NotFound();

            // On refuse de déplacer la tâche vers un autre projet
            if (existingTask.ProjectId != task.ProjectId)
                return BadRequest();

            existingTask.Title = task.Title;
            existingTask.Status = task.Status;
            existingTask.Priority = task.Priority;
            existingTask.IsImportant = task.IsImportant;
            _context.SaveChanges();

            _notifier.OnEntityChanged(userId, "Une tache a été mise à jour !");
            return Ok(existingTask);
        }
    }
}
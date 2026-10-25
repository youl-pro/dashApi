using dashApi.Data;
using dashApi.Models;
using dashApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace dashApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly INotificationObserver _notifier;

        public ProjectsController(AppDbContext context, INotificationObserver notifier)
        {
            _context = context;
            _notifier = notifier;
        }

        // GET /api/projects?userId=5 : seulement les projets de cet utilisateur
        // [FromQuery] : userId est lu dans l'adresse, après le "?"
        [HttpGet]
        public ActionResult<List<Project>> GetProjects([FromQuery] int userId)
        {
            if (userId <= 0)
                return BadRequest("userId est obligatoire.");

            // Where garde seulement les projets dont le UserId correspond
            var projects = _context.Projects
                .Where(p => p.UserId == userId)
                .ToList();
            return Ok(projects);
        }

        // GET /api/projects/3?userId=5 : un projet, seulement s'il appartient à cet utilisateur
        [HttpGet("{id}")]
        public ActionResult<Project> GetProject(int id, [FromQuery] int userId)
        {
            // On cherche par Id ET par propriétaire : le projet d'un autre est invisible
            var project = _context.Projects
                .FirstOrDefault(p => p.Id == id && p.UserId == userId);

            if (project == null) return NotFound();
            return Ok(project);
        }

        // POST /api/projects : le front envoie le projet avec le UserId de l'utilisateur connecté
        [HttpPost]
        public ActionResult<Project> CreateProject(Project project)
        {
            if (string.IsNullOrWhiteSpace(project.Name))
                return BadRequest("Le nom du projet est obligatoire.");

            // Le projet doit appartenir à un utilisateur qui existe
            if (!_context.Users.Any(u => u.Id == project.UserId))
                return BadRequest("Utilisateur introuvable.");

            project.Id = 0; // c'est la base qui attribue l'Id
            project.CreatedAt = DateTime.UtcNow;
            _context.Projects.Add(project);
            _context.SaveChanges();

            // La notification va maintenant au propriétaire (avant : toujours l'utilisateur 1)
            _notifier.OnEntityChanged(project.UserId, "Projets Rajouter !");
            return Ok(project);
        }

        // DELETE /api/projects/3?userId=5 : seulement le propriétaire peut supprimer
        [HttpDelete("{id}")]
        public ActionResult<Project> DeleteProject(int id, [FromQuery] int userId)
        {
            var project = _context.Projects
                .FirstOrDefault(p => p.Id == id && p.UserId == userId);

            // 404 aussi si le projet existe mais appartient à un autre :
            // on ne révèle pas son existence
            if (project == null) return NotFound();

            _context.Projects.Remove(project);
            _context.SaveChanges();
            _notifier.OnEntityChanged(userId, "Projets Supprimer !");
            return Ok(project);
        }

        // PUT /api/projects/3?userId=5 : seulement le propriétaire peut modifier
        [HttpPut("{id}")]
        public ActionResult<Project> UpdateProject(int id, Project project, [FromQuery] int userId)
        {
            var existingProject = _context.Projects
                .FirstOrDefault(p => p.Id == id && p.UserId == userId);

            if (existingProject == null) return NotFound();

            existingProject.Name = project.Name;
            existingProject.Description = project.Description;
            _context.SaveChanges();

            _notifier.OnEntityChanged(userId, "Projets MAJ !");
            return Ok(existingProject);
        }
    }
}
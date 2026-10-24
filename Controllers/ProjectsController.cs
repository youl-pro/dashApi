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


        [HttpGet]
        public ActionResult<List<Project>> GetProjects()
        {
            var projects = _context.Projects.ToList();
            return Ok(projects);
        }




        [HttpGet("{id}")]
        public ActionResult<Project> GetProject(int id)
        {
            Project project = _context.Projects.Find(id);

            if (project == null)
            {
                return NotFound();
            }

            else
            {

                return Ok(project);


            }
        }
        
        
     [HttpPost]
     public ActionResult <Project> CreateProject(Project project)
        {
            project.CreatedAt = DateTime.UtcNow;
            _context.Projects.Add(project);


           _context.SaveChanges();

            _notifier.OnEntityChanged(1, "Projets Rajouter !");
                return Ok(project);
        }




        [HttpDelete("{id}")]

        public ActionResult<Project> DeleteProject(int id)
        {
            Project project = _context.Projects.Find(id);

            if (project == null)
            {
                return NotFound();
            }


            else
            {
              _context.Remove(project);
                _context.SaveChanges();
                _notifier.OnEntityChanged(1, "Projets Supprimer !");
                return Ok(project);
            }
   

        }

        [HttpPut("{id}")]
        public ActionResult<Project> UpdateProject(int  id, Project project)
        {
           Project existingProject = _context.Projects.Find(id);
            if (existingProject == null) { 
            
            return NotFound();
            }

            else
            {
                existingProject.Name = project.Name;
                existingProject.Description = project.Description;
          
                _context.SaveChanges();
                _notifier.OnEntityChanged(1, "Projets MAJ !");
                return Ok(existingProject);

            }

        }





       
    
    
    }
}


using dashApi.Data;                  // AppDbContext (l'accès à la base de données)
using dashApi.Models;                // User et LoginRequest
using Microsoft.AspNetCore.Identity; // PasswordHasher (l'outil de hachage)
using Microsoft.AspNetCore.Mvc;      // ControllerBase, ActionResult, [HttpGet]...

namespace dashApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]      // l'adresse de ce contrôleur : /api/users
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        // ASP.NET Core fournit tout seul le AppDbContext (injection de dépendances)
        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/users : la liste des utilisateurs
        [HttpGet]
        public ActionResult GetUsers()
        {
            // Select crée de nouveaux objets avec SEULEMENT id, nom et courriel :
            // le mot de passe ne sort jamais de l'API
            var users = _context.Users
                .Select(u => new { u.Id, u.Name, u.Email })
                .ToList();
            return Ok(users);
        }

        // GET /api/users/3 : un seul utilisateur
        [HttpGet("{id}")]
        public ActionResult GetUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();   // 404 : il n'existe pas
            return Ok(new { user.Id, user.Name, user.Email });
        }

        // POST /api/users : l'INSCRIPTION (créer un utilisateur)
        [HttpPost]
        public ActionResult CreateUser(User user)
        {
            // 1. Le courriel et le mot de passe sont obligatoires (400 = demande invalide)
            if (string.IsNullOrWhiteSpace(user.Email))
                return BadRequest("Le courriel est obligatoire.");
            if (string.IsNullOrWhiteSpace(user.Password))
                return BadRequest("Le mot de passe est obligatoire.");

            // 2. On enlève les espaces autour du courriel
            var email = user.Email.Trim();

            // 3. Deux comptes ne peuvent pas avoir le même courriel (409 = doublon)
            if (_context.Users.Any(u => u.Email == email))
                return Conflict("Ce courriel est déjà utilisé.");

            user.Email = email;

            // 4. On remplace le mot de passe par son hachage : un long texte
            //    impossible à reconvertir en mot de passe
            var hasher = new PasswordHasher<User>();
            user.Password = hasher.HashPassword(user, user.Password);

            // 5. Add prépare l'ajout, SaveChanges l'envoie à PostgreSQL
            _context.Users.Add(user);
            _context.SaveChanges();

            // 6. On renvoie l'utilisateur SANS son mot de passe
            return Ok(new { user.Id, user.Name, user.Email });
        }

        // POST /api/users/login : la CONNEXION
        [HttpPost("login")]
        public ActionResult Login(LoginRequest request)
        {
            // On cherche l'utilisateur par son courriel
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);

            // Même message si le courriel OU le mot de passe est faux :
            // on ne dit pas lequel, pour ne rien révéler à un pirate (401 = non autorisé)
            if (user == null || user.Password == null)
                return Unauthorized("Courriel ou mot de passe invalide.");

            // On compare le mot de passe tapé avec le hachage enregistré
            var hasher = new PasswordHasher<User>();
            var resultat = hasher.VerifyHashedPassword(user, user.Password, request.Password);
            if (resultat == PasswordVerificationResult.Failed)
                return Unauthorized("Courriel ou mot de passe invalide.");

            return Ok(new { user.Id, user.Name, user.Email });
        }

        // PUT /api/users/3 : modifier le nom et le courriel
        // (le mot de passe n'est pas modifiable ici, on ajoutera ça plus tard)
        [HttpPut("{id}")]
        public ActionResult UpdateUser(int id, User user)
        {
            var existingUser = _context.Users.Find(id);
            if (existingUser == null) return NotFound();

            existingUser.Name = user.Name;
            existingUser.Email = user.Email;
            _context.SaveChanges();
            return Ok(new { existingUser.Id, existingUser.Name, existingUser.Email });
        }

        // DELETE /api/users/3 : supprimer un utilisateur
        [HttpDelete("{id}")]
        public ActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            _context.SaveChanges();
            return NoContent();   // 204 : supprimé, rien à renvoyer
        }
    }
}
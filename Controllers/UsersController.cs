using dashApi.Data;
using dashApi.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace dashApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        public UsersController(AppDbContext context)
        {
            _context = context;
        }
        [HttpGet]
        public ActionResult GetUsers()
        {
            // On ne renvoie pas le mot de passe : seulement id, nom et courriel
            var users = _context.Users.Select(u => new { u.Id, u.Name, u.Email }).ToList();
            return Ok(users);
        }





        [HttpPost("login")]
        public ActionResult Login(LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null || user.Password == null)
                return Unauthorized("Courriel ou mot de passe invalide.");

            // On compare le mot de passe tapé avec le hachage enregistré
            var hasher = new PasswordHasher<User>();
            var resultat = hasher.VerifyHashedPassword(user, user.Password, request.Password);
            if (resultat == PasswordVerificationResult.Failed)
                return Unauthorized("Courriel ou mot de passe invalide.");

            return Ok(new { user.Id, user.Name, user.Email });
        }


        [HttpGet("{id}")]
        public ActionResult GetUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();
            return Ok(new { user.Id, user.Name, user.Email });
        }



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


        [HttpDelete("{id}")]
        public ActionResult DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            _context.Users.Remove(user);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
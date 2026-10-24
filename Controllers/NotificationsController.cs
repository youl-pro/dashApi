using dashApi.Data;
using dashApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace dashApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotificationsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Notification>> GetNotifications()
        {
            var notifications = _context.Notifications.ToList();
            return Ok(notifications);
        }


        [HttpPatch("{id}/read")]
        public ActionResult<Notification> MarkAsRead(int id)
        {
            var notification = _context.Notifications.Find(id);

            if (notification == null)
            {
                return NotFound();
            }

            notification.IsRead = true;
            _context.SaveChanges();

            return Ok(notification);
        }

        [HttpDelete("{id}")]
        public ActionResult<Notification> DeleteNotification(int id)
        {
            var notification = _context.Notifications.Find(id);

            if (notification == null)
            {
                return NotFound();
            }
            else
            {
                _context.Remove(notification);
                _context.SaveChanges();
                return Ok(notification);
            }
        }
    }
}
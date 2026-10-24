using dashApi.Data;
using dashApi.Models;

namespace dashApi.Services
{
    public class NotificationService : INotificationObserver
    {
        private readonly AppDbContext _context;

        public NotificationService(AppDbContext context)
        {
            _context = context;
        }

        public void OnEntityChanged(int userId, string message)
        {
            var notification = new Notification
            {
                UserId = userId,
                Message = message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.Notifications.Add(notification);
            _context.SaveChanges();
        }
    }
}
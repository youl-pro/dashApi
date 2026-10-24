namespace dashApi.Services
{
    public interface INotificationObserver
    {
        void OnEntityChanged(int userId, string message);
    }
}

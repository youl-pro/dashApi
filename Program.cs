using dashApi.Data;
using dashApi.Services;
using Microsoft.EntityFrameworkCore;

// Crée le "builder" : un objet qui rassemble toute la configuration
// de l'application avant qu'elle soit réellement construite/démarrée
var builder = WebApplication.CreateBuilder(args);

// Ajoute le support des contrôleurs (nécessaire pour utiliser
// des classes [ApiController] avec des routes comme [HttpGet])
builder.Services.AddControllers();



// Ajoute le support d'OpenAPI (génère une documentation/spec
// de ton API, utile pour la tester via Swagger par exemple)
builder.Services.AddOpenApi();

// Enregistre AppDbContext comme service disponible dans toute l'app,
// configuré pour utiliser PostgreSQL (UseNpgsql) avec la chaîne de
// connexion définie dans appsettings.json, et applique la convention
// snake_case aux noms de colonnes/tables générés
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .UseSnakeCaseNamingConvention());



builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});



builder.Services.AddScoped<INotificationObserver, NotificationService>();


// Construit l'application à partir de toute la config précédente —
// APRÈS cette ligne, on ne peut plus ajouter de nouveaux services
var app = builder.Build();
// Si l'app tourne en environnement de développement (pas en prod),
// active la génération de la documentation OpenAPI
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Force les requêtes HTTP à être redirigées vers HTTPS (sécurité)
app.UseHttpsRedirection();



app.UseCors("AllowReactApp");
// Active la vérification des permissions/autorisations
// (utile plus tard quand on ajoutera JWT)
app.UseAuthorization();


// Relie les routes définies dans tes contrôleurs (via [HttpGet], etc.)
// au pipeline de traitement des requêtes
app.MapControllers();


// Démarre réellement le serveur, qui commence à écouter les requêtes
app.Run();
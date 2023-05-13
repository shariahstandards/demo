namespace ShariahStandards.org.DatabaseModel;

using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

public interface IApplicationDbContext{
    void Add<TEntity>(TEntity entity) where TEntity : class;
    void SaveChanges();
    IQueryable <TEntity> Set<TEntity>() where TEntity : class;
}
public class ApplicationDbContext:DbContext, IApplicationDbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder){

        modelBuilder.Entity<OneTimePasscode>(e=>{
            e.HasKey(x=>x.Id);
            e.Property(x=>x.Email).HasMaxLength(200).IsRequired();
            e.Property(x=>x.Passcode).HasMaxLength(10).IsRequired();
            e.HasIndex(x=>new{x.Email}).IsUnique();
        });
        modelBuilder.Entity<OneTimePasscode>().ToTable("OneTimePasscodes");

        // modelBuilder.Entity<User>(e=>{
        //     e.HasKey(x=>x.Id);
        //     e.Property(x=>x.VerifiedEmail).HasMaxLength(200).IsRequired();
        //     e.HasIndex(x=>x.VerifiedEmail).IsUnique();
        // });
        // modelBuilder.Entity<User>().ToTable("Users");

    }

    void IApplicationDbContext.Add<TEntity>(TEntity entity)
    {
        base.Add(entity);
    }

    void IApplicationDbContext.SaveChanges()
    {
        base.SaveChanges();
    }

    IQueryable<TEntity> IApplicationDbContext.Set<TEntity>()
    {
        return base.Set<TEntity>();
    }
    //    public override 

}

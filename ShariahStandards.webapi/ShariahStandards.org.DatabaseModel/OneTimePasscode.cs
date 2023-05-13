
namespace ShariahStandards.org.DatabaseModel;
public class OneTimePasscode
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public required string Passcode { get; set; }
    public DateTime UtcCreatedDateTime { get; set; }
    public DateTime UtcExpiryDateTime { get; set; }
    public DateTime? UtcConfirmedDateTime { get; set; }
}

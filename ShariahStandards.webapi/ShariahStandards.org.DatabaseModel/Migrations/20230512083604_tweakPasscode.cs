using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShariahStandards.org.DatabaseModel.Migrations
{
    /// <inheritdoc />
    public partial class tweakPasscode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "PassCode",
                table: "OneTimePasscodes",
                newName: "Passcode");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Passcode",
                table: "OneTimePasscodes",
                newName: "PassCode");
        }
    }
}

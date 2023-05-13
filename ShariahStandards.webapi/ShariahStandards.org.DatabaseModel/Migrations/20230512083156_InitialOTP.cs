using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ShariahStandards.org.DatabaseModel.Migrations
{
    /// <inheritdoc />
    public partial class InitialOTP : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "OneTimePasscodes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    PassCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    UtcCreatedDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UtcExpiryDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UtcConfirmedDateTime = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OneTimePasscodes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OneTimePasscodes_Email",
                table: "OneTimePasscodes",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "OneTimePasscodes");
        }
    }
}

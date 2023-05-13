[CmdletBinding()]
param (
    [Parameter(Mandatory=$true)]
    [string]
    $MigrationName

    
)
dotnet ef migrations add $MigrationName --startup-project .\ShariahStandards.org.WebApi\ShariahStandards.org.WebApi.csproj --project .\ShariahStandards.org.DatabaseModel\ShariahStandards.org.DatabaseModel.csproj
# Quick Test Script for Bulk Import API
# This script helps test the bulk import endpoints

Write-Host "=== Rental App Bulk Import Test Script ===" -ForegroundColor Green
Write-Host ""

# Configuration
$BASE_URL = "http://localhost:3002"
$JWT_TOKEN = Read-Host "Enter your JWT token (or press Enter to skip auth test)"

if ([string]::IsNullOrWhiteSpace($JWT_TOKEN)) {
    Write-Host "No token provided. Skipping authenticated tests." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To get a JWT token:" -ForegroundColor Cyan
    Write-Host "1. Login to the app as a manager" -ForegroundColor Cyan
    Write-Host "2. Open browser DevTools > Network tab" -ForegroundColor Cyan
    Write-Host "3. Copy the token from any Authorization header" -ForegroundColor Cyan
    Write-Host ""
    exit
}

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $JWT_TOKEN"
}

# Test 1: Check server health
Write-Host "Test 1: Checking server health..." -ForegroundColor Cyan
try {
    $health = Invoke-RestMethod -Uri "$BASE_URL/health" -Method Get
    Write-Host "✓ Server is running" -ForegroundColor Green
    Write-Host "  Status: $($health.status)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "✗ Server is not running or not accessible" -ForegroundColor Red
    Write-Host "  Please start the server: cd server && npm run dev" -ForegroundColor Yellow
    exit
}

# Test 2: Get current stats
Write-Host "Test 2: Getting current bulk import stats..." -ForegroundColor Cyan
try {
    $stats = Invoke-RestMethod -Uri "$BASE_URL/bulk/stats" -Headers $headers -Method Get
    Write-Host "✓ Stats retrieved successfully" -ForegroundColor Green
    Write-Host "  Total Locations: $($stats.totalLocations)" -ForegroundColor White
    Write-Host "  Total Properties: $($stats.totalProperties)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get stats" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Make sure you're using a manager JWT token" -ForegroundColor Yellow
    Write-Host ""
}

# Test 3: Import test locations
Write-Host "Test 3: Importing test locations..." -ForegroundColor Cyan
$testLocations = @{
    locations = @(
        @{
            address = "100 Test Street"
            city = "Test City"
            state = "TC"
            country = "United States"
            postalCode = "12345"
            latitude = 40.7128
            longitude = -74.0060
        }
    )
}

try {
    $locationResult = Invoke-RestMethod -Uri "$BASE_URL/bulk/locations" -Headers $headers -Method Post -Body ($testLocations | ConvertTo-Json -Depth 10)
    Write-Host "✓ Locations imported successfully" -ForegroundColor Green
    Write-Host "  Created: $($locationResult.created)" -ForegroundColor White
    Write-Host "  Failed: $($locationResult.failed)" -ForegroundColor White
    Write-Host ""
    
    $newLocationId = $locationResult.locations[0].id
    Write-Host "  New Location ID: $newLocationId" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "✗ Failed to import locations" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    $newLocationId = $null
}

# Test 4: Import test property
if ($newLocationId) {
    Write-Host "Test 4: Importing test property..." -ForegroundColor Cyan
    $testProperties = @{
        defaultManagerId = "010be580-60a1-70ae-780e-18a6fd94ad32"
        properties = @(
            @{
                name = "Test Property"
                description = "A test property created via bulk import API"
                pricePerMonth = 1500
                securityDeposit = 1500
                applicationFee = 50
                beds = 2
                baths = 1
                squareFeet = 900
                propertyType = "Apartment"
                isPetsAllowed = $true
                isParkingIncluded = $false
                amenities = @("WiFi", "AirConditioning")
                highlights = @("CloseToTransit")
                photoUrls = @("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80")
                locationId = $newLocationId
            }
        )
    }

    try {
        $propertyResult = Invoke-RestMethod -Uri "$BASE_URL/bulk/properties" -Headers $headers -Method Post -Body ($testProperties | ConvertTo-Json -Depth 10)
        Write-Host "✓ Properties imported successfully" -ForegroundColor Green
        Write-Host "  Created: $($propertyResult.created)" -ForegroundColor White
        Write-Host "  Failed: $($propertyResult.failed)" -ForegroundColor White
        Write-Host ""
    } catch {
        Write-Host "✗ Failed to import properties" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Test 5: Get updated stats
Write-Host "Test 5: Getting updated stats..." -ForegroundColor Cyan
try {
    $updatedStats = Invoke-RestMethod -Uri "$BASE_URL/bulk/stats" -Headers $headers -Method Get
    Write-Host "✓ Updated stats retrieved" -ForegroundColor Green
    Write-Host "  Total Locations: $($updatedStats.totalLocations)" -ForegroundColor White
    Write-Host "  Total Properties: $($updatedStats.totalProperties)" -ForegroundColor White
    Write-Host ""
} catch {
    Write-Host "✗ Failed to get updated stats" -ForegroundColor Red
    Write-Host ""
}

Write-Host "=== Test Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Check Prisma Studio to see the imported data: npx prisma studio" -ForegroundColor White
Write-Host "2. Test the search functionality on the frontend" -ForegroundColor White
Write-Host "3. Import more data using the example files in server/testData/" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see:" -ForegroundColor Cyan
Write-Host "- BULK_IMPORT_API.md - Complete API documentation" -ForegroundColor White
Write-Host "- SEED_DATA_GUIDE.md - Setup and testing guide" -ForegroundColor White
Write-Host ""

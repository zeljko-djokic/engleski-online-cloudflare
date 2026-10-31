$ErrorActionPreference = "Stop"

$path = Join-Path (Get-Location) "app\page.tsx"

if (-not (Test-Path $path)) {
    Write-Host ""
    Write-Host "GRESKA: Nisam nasao app\page.tsx u trenutnom folderu." -ForegroundColor Red
    Write-Host "Premesti ovaj paket u root folder Engleski Online projekta i pokreni ponovo."
    exit 1
}

$content = Get-Content -Raw -Encoding UTF8 $path

$pricingStartMarker = '        <section className="section pricing-section" id="cenovnik">'
$faqStartMarker = '        <section className="section faq-section">'
$aboutStartMarker = '        <section className="section about-section" id="o-meni">'

$pricingStart = $content.IndexOf($pricingStartMarker)
$faqStart = $content.IndexOf($faqStartMarker)

if ($pricingStart -lt 0 -or $faqStart -lt 0 -or $faqStart -le $pricingStart) {
    Write-Host "GRESKA: Nisam nasao blok Cenovnik/FAQ u ocekivanom obliku." -ForegroundColor Red
    exit 1
}

$pricingSection = $content.Substring($pricingStart, $faqStart - $pricingStart)

$individualMarker = @'
              <article className="price-card featured-price">
                <p>{labels.pricingIndividualLabel}</p>
'@

$servicesMarker = @'
              <article className="price-card featured-price">
                <p>{labels.pricingServicesLabel}</p>
'@

$packageMarker = @'
              <article className="price-card">
                <p>{labels.pricingPackageLabel}</p>
'@

$individualStart = $pricingSection.IndexOf($individualMarker.TrimEnd("`r","`n"))
$servicesStart = $pricingSection.IndexOf($servicesMarker.TrimEnd("`r","`n"))
$packageStart = $pricingSection.IndexOf($packageMarker.TrimEnd("`r","`n"))

if ($individualStart -lt 0 -or $servicesStart -lt 0 -or $packageStart -lt 0) {
    Write-Host "GRESKA: Nisam nasao kartice cenovnika u ocekivanom obliku." -ForegroundColor Red
    exit 1
}

if (-not ($individualStart -lt $servicesStart -and $servicesStart -lt $packageStart)) {
    Write-Host "INFO: Izgleda da je redosled kartica vec promenjen. Nista nije izmenjeno." -ForegroundColor Yellow
    exit 0
}

$prefix = $pricingSection.Substring(0, $individualStart)
$individualCard = $pricingSection.Substring($individualStart, $servicesStart - $individualStart)
$servicesCard = $pricingSection.Substring($servicesStart, $packageStart - $servicesStart)
$suffix = $pricingSection.Substring($packageStart)

$pricingSection = $prefix + $servicesCard + $individualCard + $suffix

# Ukloni stari Cenovnik sa kraja stranice.
$contentWithoutPricing = $content.Substring(0, $pricingStart) + $content.Substring($faqStart)

# Ubaci Cenovnik odmah posle Jezičkih usluga, tj. neposredno pre O meni.
$aboutStart = $contentWithoutPricing.IndexOf($aboutStartMarker)
if ($aboutStart -lt 0) {
    Write-Host "GRESKA: Nisam nasao sekciju O meni." -ForegroundColor Red
    exit 1
}

$newContent = $contentWithoutPricing.Substring(0, $aboutStart) + $pricingSection + $contentWithoutPricing.Substring($aboutStart)

# Napravi rezervnu kopiju pre izmene.
$backup = "$path.bak"
Copy-Item $path $backup -Force

# UTF-8 bez BOM-a
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($path, $newContent, $utf8NoBom)

Write-Host ""
Write-Host "USPESNO." -ForegroundColor Green
Write-Host "Na pocetnoj strani je sada redosled:"
Write-Host "  1. Jezičke usluge"
Write-Host "  2. Cenovnik odmah ispod njih"
Write-Host "  3. U cenovniku: Jezičke usluge -> Individualni časovi -> Paket -> Grupni popusti"
Write-Host ""
Write-Host "Backup je sacuvan kao app\page.tsx.bak"
Write-Host "Sada otvori GitHub Desktop, proveri diff, pa Commit + Push."

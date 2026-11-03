Add-Type -AssemblyName System.Drawing

$sourcePath = "c:\Users\advan\dev\pemrograman-mobile\game-edukasi\public\assets\ui\hero-triangle.png"
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source image not found: $sourcePath"
    exit 1
}

$sourceImg = [System.Drawing.Image]::FromFile($sourcePath)

# Color definitions
$skyColor = [System.Drawing.ColorTranslator]::FromHtml("#38BDF8")
$whiteColor = [System.Drawing.Color]::White
$glowColor = [System.Drawing.ColorTranslator]::FromHtml("#BAE6FD")

# Helper function to draw high quality scaled image centered
function Draw-CenteredImage {
    param(
        [System.Drawing.Graphics]$g,
        [System.Drawing.Image]$img,
        [int]$canvasW,
        [int]$canvasH,
        [float]$scaleRatio,
        [float]$yOffsetRatio = 0.0
    )
    $maxW = $canvasW * $scaleRatio
    $maxH = $canvasH * $scaleRatio
    
    $aspect = $img.Width / $img.Height
    if ($maxW / $maxH -gt $aspect) {
        $destH = $maxH
        $destW = $destH * $aspect
    } else {
        $destW = $maxW
        $destH = $destW / $aspect
    }
    
    $destX = ($canvasW - $destW) / 2
    $destY = (($canvasH - $destH) / 2) + ($canvasH * $yOffsetRatio)
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $g.DrawImage($img, [float]$destX, [float]$destY, [float]$destW, [float]$destH)
}

# Android mipmap targets
$sizes = @(
    @{ Folder = "mipmap-mdpi";    Square = 48;  Fg = 108 },
    @{ Folder = "mipmap-hdpi";    Square = 72;  Fg = 162 },
    @{ Folder = "mipmap-xhdpi";   Square = 96;  Fg = 216 },
    @{ Folder = "mipmap-xxhdpi";  Square = 144; Fg = 324 },
    @{ Folder = "mipmap-xxxhdpi"; Square = 192; Fg = 432 }
)

$baseDir = "c:\Users\advan\dev\pemrograman-mobile\game-edukasi\android\app\src\main\res"

foreach ($item in $sizes) {
    $folder = Join-Path $baseDir $item.Folder
    $dim = $item.Square
    $fgDim = $item.Fg
    
    # 1. ic_launcher.png (Standard Icon with Sky Blue bg + Mascot)
    $bmpSquare = New-Object System.Drawing.Bitmap($dim, $dim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmpSquare)
    $g.Clear($skyColor)
    
    # Subtle inner white circle glow
    $brush = New-Object System.Drawing.SolidBrush($glowColor)
    $glowPadding = $dim * 0.08
    $g.FillEllipse($brush, $glowPadding, $glowPadding, $dim - (2 * $glowPadding), $dim - (2 * $glowPadding))
    $brush.Dispose()
    
    # Draw mascot centered (taking 82% of area)
    Draw-CenteredImage -g $g -img $sourceImg -canvasW $dim -canvasH $dim -scaleRatio 0.82
    $g.Dispose()
    
    $outSquare = Join-Path $folder "ic_launcher.png"
    $bmpSquare.Save($outSquare, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpSquare.Dispose()
    Write-Host "Created $outSquare ($dim x $dim)"
    
    # 2. ic_launcher_round.png (Circular Icon with Sky Blue bg + Mascot)
    $bmpRound = New-Object System.Drawing.Bitmap($dim, $dim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gRound = [System.Drawing.Graphics]::FromImage($bmpRound)
    $gRound.Clear([System.Drawing.Color]::Transparent)
    $gRound.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    
    # Draw circle background
    $skyBrush = New-Object System.Drawing.SolidBrush($skyColor)
    $gRound.FillEllipse($skyBrush, 0, 0, $dim - 1, $dim - 1)
    $skyBrush.Dispose()
    
    # Subtle inner glow
    $glowBrush = New-Object System.Drawing.SolidBrush($glowColor)
    $gRound.FillEllipse($glowBrush, [float]($dim * 0.08), [float]($dim * 0.08), [float]($dim * 0.84), [float]($dim * 0.84))
    $glowBrush.Dispose()
    
    # Draw mascot centered inside circle
    Draw-CenteredImage -g $gRound -img $sourceImg -canvasW $dim -canvasH $dim -scaleRatio 0.80
    $gRound.Dispose()
    
    $outRound = Join-Path $folder "ic_launcher_round.png"
    $bmpRound.Save($outRound, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpRound.Dispose()
    Write-Host "Created $outRound ($dim x $dim)"
    
    # 3. ic_launcher_foreground.png (Adaptive Foreground - transparent background, mascot in safe zone ~65%)
    $bmpFg = New-Object System.Drawing.Bitmap($fgDim, $fgDim, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gFg = [System.Drawing.Graphics]::FromImage($bmpFg)
    $gFg.Clear([System.Drawing.Color]::Transparent)
    
    # In adaptive icon 108dp canvas, safe zone diameter is 66-70dp (~65% scale)
    Draw-CenteredImage -g $gFg -img $sourceImg -canvasW $fgDim -canvasH $fgDim -scaleRatio 0.65
    $gFg.Dispose()
    
    $outFg = Join-Path $folder "ic_launcher_foreground.png"
    $bmpFg.Save($outFg, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmpFg.Dispose()
    Write-Host "Created $outFg ($fgDim x $fgDim)"
}

# 4. Generate public web app icons
$webFaviconPath = "c:\Users\advan\dev\pemrograman-mobile\game-edukasi\public\favicon.png"
$bmpFavicon = New-Object System.Drawing.Bitmap(192, 192, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gFav = [System.Drawing.Graphics]::FromImage($bmpFavicon)
$gFav.Clear([System.Drawing.Color]::Transparent)
$skyBrush = New-Object System.Drawing.SolidBrush($skyColor)
$gFav.FillEllipse($skyBrush, 0, 0, 191, 191)
$skyBrush.Dispose()
Draw-CenteredImage -g $gFav -img $sourceImg -canvasW 192 -canvasH 192 -scaleRatio 0.82
$gFav.Dispose()
$bmpFavicon.Save($webFaviconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmpFavicon.Dispose()
Write-Host "Created $webFaviconPath (192 x 192)"

# 5. Generate high-res app-icon.png for PWA / Stores
$appIconPath = "c:\Users\advan\dev\pemrograman-mobile\game-edukasi\public\app-icon.png"
$bmpApp = New-Object System.Drawing.Bitmap(512, 512, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$gApp = [System.Drawing.Graphics]::FromImage($bmpApp)
$gApp.Clear([System.Drawing.Color]::Transparent)
$skyBrush = New-Object System.Drawing.SolidBrush($skyColor)
$gApp.FillEllipse($skyBrush, 0, 0, 511, 511)
$skyBrush.Dispose()
$glowBrush = New-Object System.Drawing.SolidBrush($glowColor)
$gApp.FillEllipse($glowBrush, 40, 40, 432, 432)
$glowBrush.Dispose()
Draw-CenteredImage -g $gApp -img $sourceImg -canvasW 512 -canvasH 512 -scaleRatio 0.82
$gApp.Dispose()
$bmpApp.Save($appIconPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmpApp.Dispose()
Write-Host "Created $appIconPath (512 x 512)"

$sourceImg.Dispose()
Write-Host "All icons generated successfully!"

#!/usr/bin/env php
<?php
/**
 * Resize report section images to column width (688px) for faster loads.
 * Uses PHP GD. Run from repo root: php scripts/resize-section-images.php
 * Back up originals first if you need full resolution.
 */

if (!extension_loaded('gd')) {
    fwrite(STDERR, "Error: PHP GD extension is required. Install it (e.g. brew install php, or enable gd in php.ini).\n");
    exit(1);
}

$repoRoot = dirname(__DIR__);
$reportDir = $repoRoot . '/public/report';
$width = 688;

if (!is_dir($reportDir)) {
    fwrite(STDERR, "Error: public/report not found. Run from repo root.\n");
    exit(1);
}

$files = glob($reportDir . '/report-*.png');
if (empty($files)) {
    fwrite(STDERR, "No report-*.png files found in public/report.\n");
    exit(1);
}

foreach ($files as $path) {
    $name = basename($path);
    $info = @getimagesize($path);
    if ($info === false) {
        fwrite(STDERR, "  Skip (not a valid image): $name\n");
        continue;
    }
    if ($info[2] !== IMAGETYPE_PNG) {
        fwrite(STDERR, "  Skip (not PNG): $name\n");
        continue;
    }

    $w = (int) $info[0];
    $h = (int) $info[1];
    if ($w <= $width) {
        echo "  $name (already <= {$width}px wide)\n";
        continue;
    }

    $newH = (int) round($h * ($width / $w));
    $src = @imagecreatefrompng($path);
    if ($src === false) {
        fwrite(STDERR, "  Skip (could not load): $name\n");
        continue;
    }

    $dst = imagecreatetruecolor($width, $newH);
    if ($dst === false) {
        imagedestroy($src);
        fwrite(STDERR, "  Skip (could not create image): $name\n");
        continue;
    }

    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefill($dst, 0, 0, $transparent);

    imagecopyresampled($dst, $src, 0, 0, 0, 0, $width, $newH, $w, $h);
    imagedestroy($src);

    if (!imagepng($dst, $path, 6)) {
        fwrite(STDERR, "  Failed to write: $name\n");
    } else {
        echo "  $name -> {$width}x{$newH}\n";
    }
    imagedestroy($dst);
}

echo "Done. Section images resized to {$width}px width.\n";

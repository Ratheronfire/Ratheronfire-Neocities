param(
    $path,
    $scale
)

$file = Get-Item $path
$thumb_file = [System.IO.Path]::GetDirectoryName($file) + "/" + $file.Basename + "-thumb" + $file.extension

magick $file -resize $scale $thumb_file
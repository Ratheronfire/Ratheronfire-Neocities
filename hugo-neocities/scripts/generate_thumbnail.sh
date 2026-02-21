filename=${1%.*}
extension=${1##*.}

ffmpeg -i "$1" -y -vf scale=iw/$2:ih/$2 "${filename}-thumb.${extension}" -hide_banner -loglevel error

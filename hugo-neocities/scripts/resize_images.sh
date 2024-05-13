cd "$1"

for img in *.png; do
	if [[ $img != "scaled_"* ]]; then
		ffmpeg -i "$img" -y -vf scale=1280:720 "scaled_${img}" -hide_banner -loglevel error
	fi
done
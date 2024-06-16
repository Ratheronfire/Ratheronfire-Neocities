cd "$1"

for img in *.png; do
	if [[ $img != "scaled_"* ]]; then
		ffmpeg -i "$img" -y -vf scale=640:360 "scaled_${img}" -hide_banner -loglevel error
	fi
done
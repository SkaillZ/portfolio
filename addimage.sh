#!/bin/sh

script_path="$( cd "$(dirname "$0")" ; pwd -P )"
images_path="$script_path/images"
lowres_identifier="lowres"
highres_identifier="highres"

error() {
    echo "\033[0;31m$1\033[0;31m" >&2
}

usage() {
    echo "Usage: $0 filenames..."
}

process() {
    for path in "$@"; do
        if [ ! -e "$path" ]; then
            error "File not found. Skipping '$path'"
            continue
        fi

        # Get path without extension
        basename=$(basename "$path")
        filename="${basename%.*}"
	    ext="${basename##*.}" # Dateiendung in Variable speichern

        if [ -f "$path" ]; then
            echo "Processing '$path'..."
			convert "$path" -resize 1500x1500\> "$images_path/$filename-$highres_identifier.jpg" || error "Error converting '$path'"
            convert "$path" -quality 60 -resize 64x64\> "$images_path/$filename-$lowres_identifier.jpg" || error "Error converting '$path'"
        else
            error "'$path' is not a file. Skipping '$path'"
		fi
    done
}

if [ $# -eq 0 ]; then
    usage
    exit 1
fi

process "$@"

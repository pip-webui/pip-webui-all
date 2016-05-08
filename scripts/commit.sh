function cleanexec {
    "$@"
    status=$?
    if [ $status -ne 0 ]; then
        echo "error with $1" >&2
    fi
    return 0
}


cleanexec git add ../dist
cleanexec git commit -am "CI commit"
cleanexec git push

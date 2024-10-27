#!/bin/bash

# Convert HTML to PDF using Pandoc

# pandoc test3.html \
#     --to=pdf \
#     -t latex \
#     -o TEST_PANDOC.pdf \
#     --pdf-engine=/Library/TeX/texbin/pdflatex

pandoc output_charts/test4.html \
    -V geometry:landscape \
    -V docuclass:standalone \
    --to=pdf \
    -t latex \
    -o output_charts/TEST_PANDOC.pdf \
    --pdf-engine=/Library/TeX/texbin/xelatex \
    --standalone=True \
    --pdf-engine-opt=--shell-escape \
    -V mainfont="Arial" \
    -V header-includes="\usepackage{graphicx}" \
    -V header-includes="\usepackage{svg}" \
    -V header-includes="\usepackage{fontspec}" \
    -V header-includes="\usepackage{catchfile}" \
    -V header-includes="\usepackage{transparent}" \


# Get just the TEX
# pandoc -s output_charts/test4.html -o output_charts/TEX_TEST1.tex
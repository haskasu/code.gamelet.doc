# code.gamelet.doc
Source of the Documentation of Code.Gamelet.com

https://haskasu.github.io/code.gamelet.doc

## Install
* install python3
* add path to python\python37\Scripts
* pip install -U sphinx
* easy_install sphinx-intl
* pip install sphinx_materialdesign_theme

## Commands

make gettext
sphinx-intl update -p build/gettext
sphinx-intl build
make -e SPHINXOPTS="-D language='zh'" html

## Gulp Tasks
gulp build
gulp intl
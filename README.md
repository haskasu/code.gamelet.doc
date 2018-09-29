# code.gamelet.doc
Source of the Documentation of Code.Gamelet.com

https://haskasu.github.io/code.gamelet.doc

## Install
https://dont-be-afraid-to-commit.readthedocs.io/en/latest/documentation.html

## Update
pip install -U sphinx

## Commands
easy_install sphinx-intl
make gettext
sphinx-intl update -p build/gettext
sphinx-intl build
make -e SPHINXOPTS="-D language='zh'" html

## Gulp Tasks
gulp build
gulp intl
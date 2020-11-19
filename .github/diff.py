import subprocess
import sys
import difflib

def prepend(itm):
    return '\'' + itm

master = sys.argv[1].replace('%0A', '\n')
branch = sys.argv[2].replace('%0A', '\n')
diff = ''.join(difflib.Differ().compare(master.splitlines(True), branch.splitlines(True)))
lines = [line for line in diff.splitlines() if line[0] == '+' or line[0] == '-' or line[0] == '?']
print('<br />'.join(map(prepend, lines)), end="")
